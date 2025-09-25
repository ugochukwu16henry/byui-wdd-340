const invModel = require("../models/inventory-model");
const utilities = require("../utilities"); // Add slash to indicate folder

const invController = {};

/* ****************************************
 *  Build inventory by classification view
 * **************************************** */
invController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  let nav = await utilities.getNav();

  if (data.length === 0) {
    return res.status(404).render("errors/error", {
      // Path changed to match common view structure
      title: "Not Found",
      message: "No vehicles found for this classification.",
      nav,
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
