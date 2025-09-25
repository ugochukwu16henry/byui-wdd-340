const invModel = require("../models/inventory-model");
const utilities = require("../utilities"); // Add slash to indicate folder

const invController = {};

// invController.jsconst invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invController = {};

/* ****************************************
 *  Build inventory by classification view
 * **************************************** */
invController.buildByClassificationId = async function(req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    let nav = await utilities.getNav();

    if (data.length > 0) {
        const grid = await utilities.buildClassificationGrid(data);
        const className = data[0].classification_name;

        res.render("inventory/classification", {
            title: className + " Vehicles",
            nav,
            grid,
        });
    } else {
        // Handle the case where no inventory items are found
        res.render("errors/error", {
            title: "Not Found",
            status: 404,
            message: "No inventory items were found for this classification.",
            nav, // Pass the nav variable to the error page
        });
    }
};

/* ****************************************
 *  Build detail view for a specific vehicle
 * **************************************** */
invController.buildDetail = async function (req, res, next) {
    const inv_id = req.params.inv_id;
    const vehicle = await invModel.getVehicleById(inv_id);
    let nav = await utilities.getNav();

    if (!vehicle) {
        return res.status(404).render("errors/error", {
            title: "Vehicle Not Found",
            message: "Sorry, we could not find that vehicle.",
            nav,
        });
    }

    const detail = utilities.buildVehicleDetail(vehicle);

    res.render("inventory/detail", {
        title: `${vehicle.inv_make} ${vehicle.inv_model}`,
        nav,
        detail,
    });
};

module.exports = invController;


invController.buildByClassificationId = async function(req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);

    // Add this conditional check
    if (data.length > 0) {
        const grid = await utilities.buildClassificationGrid(data);
        let nav = await utilities.getNav();
        const className = data[0].classification_name;

        res.render("inventory/classification", {
            title: className + " Vehicles",
            nav,
            grid
        });
    } else {
        // Handle the case where no inventory items are found
        let nav = await utilities.getNav();
        res.render("errors/error", {
            title: "Not Found",
            status: 404,
            message: "No inventory items were found for this classification.",
            nav // Pass the nav variable to the error page
        });
    }
};


/* ****************************************
 *  Build inventory by classification view
 * **************************************** */
invController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  let nav = await utilities.getNav();

  // invController.js
  // ... inside buildByClassificationId function
  if (data.length === 0) {
    res.render("errors/error", {
      status: 404, // Status code for "Not Found"
      message: "No inventory items found for this classification.",
      title: "Error", // Assuming your layout needs a title
    });
  }

  const grid = utilities.buildClassificationGrid(data);

  res.render("inventory/classification", {
    title: data[0].classification_name + " Vehicles",
    nav,
    grid,
  });
};

/* ****************************************
 *  Build detail view for a specific vehicle
 * **************************************** */
invController.buildDetail = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  const vehicle = await invModel.getVehicleById(inv_id);
  let nav = await utilities.getNav();

  if (!vehicle) {
    return res.status(404).render("error/error", {
      // Path changed
      title: "Vehicle Not Found",
      message: "Sorry, we could not find that vehicle.",
      nav,
    });
  }

  const detail = utilities.buildVehicleDetail(vehicle);

  res.render("inventory/detail", {
    title: `${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    detail,
  });
};

module.exports = invController;
