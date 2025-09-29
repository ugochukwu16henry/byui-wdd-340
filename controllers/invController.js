const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

// Management view
invCont.buildManagement = async (req, res, next) => {
  const nav = await utilities.getNav();
  const message = req.flash("message");
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    message,
  });
};

// Build add classification form
invCont.buildAddClassification = async (req, res, next) => {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name: "",
  });
};

// Process add classification
invCont.addClassification = async (req, res, next) => {
  const nav = await utilities.getNav();
  const { classification_name } = req.body;

  if (!classification_name || !/^[A-Za-z0-9]+$/.test(classification_name)) {
    const errors = [
      "Classification name is required and cannot contain spaces or special characters.",
    ];
    return res.status(400).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      classification_name,
    });
  }

  try {
    const result = await invModel.addClassification(classification_name);
    if (result) {
      req.flash(
        "message",
        `Classification "${classification_name}" added successfully!`
      );
      return res.redirect("/inv");
    } else {
      const errors = ["Failed to add classification. Please try again."];
      return res.status(500).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors,
        classification_name,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Build add inventory form
invCont.buildAddInventory = async (req, res, next) => {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    inv_description: "",
    inv_image: "/images/no-image.png",
    inv_thumbnail: "/images/no-image.png",
    classification_id: "",
  });
};

// Process add inventory
invCont.addInventory = async (req, res, next) => {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList(
    req.body.classification_id
  );
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

  const errors = [];
  if (!inv_make) errors.push("Make is required");
  if (!inv_model) errors.push("Model is required");
  if (!inv_year) errors.push("Year is required");
  if (!inv_price) errors.push("Price is required");
  if (!classification_id) errors.push("Classification is required");

  if (errors.length > 0) {
    return res.status(400).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors,
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
    });
  }

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
        "message",
        `Inventory item "${inv_make} ${inv_model}" added successfully!`
      );
      return res.redirect("/inv");
    } else {
      errors.push("Failed to add inventory. Please try again.");
      return res.status(500).render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors,
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
      });
    }
  } catch (error) {
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

module.exports = invCont;
