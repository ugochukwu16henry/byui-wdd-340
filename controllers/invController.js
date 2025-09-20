const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

// Classification view
async function buildByClassificationId(req, res, next) {
  try {
    const classificationId = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classificationId
    );
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className =
      data.length > 0 ? data[0].classification_name : "Vehicles";
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (err) {
    next(err);
  }
}

// Detail view
async function buildDetailView(req, res, next) {
  try {
    const invId = req.params.invId;
    const data = await invModel.getVehicleById(invId);
    let nav = await utilities.getNav();
    const detail = utilities.buildVehicleDetail(data);
    res.render("./inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      detail,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { buildByClassificationId, buildDetailView };
