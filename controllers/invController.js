const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ****************************************
 * Build Inventory Management view
 * *************************************** */
invCont.buildManagement = async (req, res, next) => {
  const nav = await utilities.getNav();
  // This is used for the AJAX table in management.ejs
  const classificationList = await utilities.buildClassificationList();

  const message = req.flash("notice");
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    message,
    // Passes classificationList
    classificationList,
  });
};

/* ****************************************
 * Task 2: Build add classification form
 * *************************************** */
invCont.buildAddClassification = async (req, res, next) => {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    classification_name: "",
  });
};

/* ****************************************
 * Task 2: Process add classification
 * *************************************** */
invCont.addClassification = async (req, res, next) => {
  const { classification_name } = req.body;

  try {
    const result = await invModel.addClassification(classification_name);

    if (result) {
      req.flash(
        "notice",
        `Classification "${classification_name}" added successfully!`
      );

      const nav = await utilities.getNav();
      const classificationList = await utilities.buildClassificationList();

      return res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null,
        message: req.flash("notice"),
        classificationList,
      });
    } else {
      req.flash("notice", "Failed to add classification. Please try again.");

      const nav = await utilities.getNav();
      return res.status(500).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        classification_name,
      });
    }
  } catch (error) {
    error.message = "Failed to add classification due to a server error.";
    next(error);
  }
};

/* ****************************************
 * Task 3: Build add inventory form
 * *************************************** */
invCont.buildAddInventory = async (req, res, next) => {
  const nav = await utilities.getNav();

  const classificationSelect = await utilities.buildClassificationList();

  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationSelect,
    errors: null,
    // CRITICAL FIX: Add inv_id to the list of variables with a default value of ''
    inv_id: "",
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image.png",
    classification_id: "",
  });
};

/* ****************************************
 * Task 3: Process add inventory
 * *************************************** */
invCont.addInventory = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    inv_miles,
    inv_color,
    inv_description,
    inv_image,
    inv_thumbnail,
    classification_id,
  } = req.body;

  try {
    const result = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_miles,
      inv_color,
      inv_description,
      inv_image,
      inv_thumbnail,
      classification_id
    );

    if (result) {
      req.flash(
        "notice",
        `Inventory item "${inv_make} ${inv_model}" added successfully!`
      );
      return res.redirect("/inv");
    } else {
      req.flash("notice", "Failed to add inventory. Please try again.");

      const nav = await utilities.getNav();
      const classificationSelect = await utilities.buildClassificationList(
        classification_id
      );

      return res.status(500).render("inventory/add-inventory", {
        title: "Add New Inventory",
        nav,
        classificationSelect,
        errors: null,
        // Ensure inv_id is passed back if validation failed, though it will be null/undefined here
        inv_id: "",
        ...req.body,
      });
    }
  } catch (error) {
    error.message = "Failed to add inventory due to a server error.";
    next(error);
  }
};

// Inventory by classification
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  const nav = await utilities.getNav();
  const className = data[0]?.classification_name || "Inventory";
  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

// Inventory detail
invCont.buildDetailView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    const data = await invModel.getVehicleById(inv_id);
    const nav = await utilities.getNav();

    if (!data || data.length === 0) {
      throw { status: 404, message: "Vehicle not found." };
    }

    const vehicle = data[0];
    const gallery =
      vehicle.inv_gallery?.split(",").map((img) => img.trim()) || [];

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
      gallery,
    });
  } catch (error) {
    next(error);
  }
};

// Footer error test
invCont.triggerError = (req, res, next) => {
  try {
    throw new Error("This is a footer-based test error!");
  } catch (err) {
    next(err);
  }
};

/* ***************************
 * Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0]?.inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 * Build edit inventory view
 * ************************** */
invCont.buildEditInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await utilities.getNav();
  const itemDataArray = await invModel.getVehicleById(inv_id);

  if (itemDataArray.length === 0) {
    throw { status: 404, message: "Sorry, that vehicle could not be found." };
  }

  const itemData = itemDataArray[0];

  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 * Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const updateResult = await invModel.updateInventory(
    parseInt(inv_id),
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 * Build delete confirmation view (NEW)
 * ************************** */
invCont.buildDeleteConfirm = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await utilities.getNav();
  const itemDataArray = await invModel.getVehicleById(inv_id);

  if (itemDataArray.length === 0) {
    throw { status: 404, message: "Sorry, that vehicle could not be found." };
  }

  const itemData = itemDataArray[0];

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    // Pass only required data for the view
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

/* ***************************
 * Process delete inventory item (NEW)
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  // Pull data from hidden inputs in the delete-confirm form
  const { inv_id, inv_make, inv_model } = req.body;

  const deleteResult = await invModel.deleteInventoryItem(parseInt(inv_id));

  if (deleteResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was successfully deleted.`
    );
    res.redirect("/inv/");
  } else {
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the deletion failed.");
    // Redirect back to confirmation page if deletion fails
    res.redirect(`/inv/delete/${inv_id}`);
  }
};

module.exports = invCont;
