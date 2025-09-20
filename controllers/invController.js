const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

async function buildByClassificationId(req, res, next) {
  const classificationId = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classificationId);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className =
    data.length > 0 ? data[0].classification_name : "No Cars Found";

  res.render("inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid,
  });
}

async function buildDetailById(req, res, next) {
  const invId = req.params.invId;
  const data = await invModel.getInventoryDetailById(invId);
  let nav = await utilities.getNav();
  res.render("inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    car: data,
  });
}

module.exports = { buildByClassificationId, buildDetailById };
