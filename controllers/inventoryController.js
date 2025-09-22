const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

/* Build inventory by classification */
async function buildByClassificationId(req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    let nav = await utilities.getNav()

    if (data.length === 0) {
      return res.status(404).render("error", {
        title: "Not Found",
        message: "No vehicles found for this classification.",
        nav,
      })
    }

    res.render("inventory/classification", {
      title: data[0].classification_name + " Vehicles",
      nav,
      vehicles: data,
    })
  } catch (err) {
    next(err)
  }
}

/* Build detail view for a specific vehicle */
async function buildDetail(req, res, next) {
  try {
    const inv_id = req.params.inv_id
    const vehicle = await invModel.getVehicleById(inv_id)
    let nav = await utilities.getNav()

    if (!vehicle) {
      return res.status(404).render("error", {
        title: "Vehicle Not Found",
        message: "Sorry, we could not find that vehicle.",
        nav,
      })
    }

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { buildByClassificationId, buildDetail }
