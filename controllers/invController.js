const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const { buildVehicleDetailHTML } = require("../utilities/index"); // adjust the path/** */

const invCont = {};
/**
 * GET /inventory/:inv_id
 */
async function showInventoryDetail(req, res, next) {
  try {
    const invId = Number(req.params.inv_id);
    if (Number.isNaN(invId)) {
      // invalid id -> 404 via next
      const err = new Error('Inventory id is invalid');
      err.status = 404;
      throw err;
    }

    const vehicle = await inventoryModel.getInventoryById(invId);
    if (!vehicle) {
      const err = new Error('Vehicle not found');
      err.status = 404;
      throw err;
    }

    const vehicleHTML = buildVehicleDetailHTML(vehicle);

    // render the detail view and pass data
    res.render('inventory/detail', {
      title: `${vehicle.inv_make} ${vehicle.inv_model} - Details`,
      vehicle,
      vehicleHTML, // if you choose to inject HTML string into view
    });
  } catch (err) {
    // forward to error-handling middleware
    next(err);
  }
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

module.exports = {
  invCont,
  showInventoryDetail,
};