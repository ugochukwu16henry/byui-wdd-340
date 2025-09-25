const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invController = {}; // Move the declaration to the top

/* ****************************************
 *  Build inventory by classification view
 * **************************************** */
invController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  let nav = await utilities.getNav();

  if (data.length > 0) {
    const grid = await utilities.buildClassificationGrid(data);
    const className = data[0].classification_name; // Access `classification_name` from the first item

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
      nav,
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

  const detail = await utilities.buildVehicleDetail(vehicle);

  res.render("inventory/detail", {
    title: `${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    detail,
  });
};

module.exports = invController;
