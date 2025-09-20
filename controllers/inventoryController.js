const invModel = require("../models/inventory-model");
const utilities = require("../utilities"); // for nav builder

/* Build inventory by classification */
async function buildByClassificationId(req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );
    let nav = await utilities.getNav();

    if (data.length === 0) {
      return res.status(404).render("errors/error", {
        title: "Not Found",
        message: "No vehicles found for this classification.",
        nav,
      });
    }

    res.render("inventory/classification", {
      title: data[0].classification_name + " Vehicles",
      nav,
      vehicles: data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { buildByClassificationId };
