const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildDetailView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const data = await invModel.getVehicleById(inv_id)
    const nav = await utilities.getNav()

    if (!data || data.length === 0) {
      throw { status: 404, message: "Vehicle not found." }
    }

    const vehicle = data[0]

    // Convert comma-separated gallery string to array
    const gallery = vehicle.inv_gallery?.split(",").map(img => img.trim()) || []

    res.render("./inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
      gallery
    })
  } catch (error) {
    next(error)
  }
}

// --- Footer Error Test Function ---
invCont.triggerError = (req, res, next) => {
  try {
    throw new Error("This is a footer-based test error!")
  } catch (err) {
    next(err) // pass error to middleware
  }
}

module.exports = invCont


