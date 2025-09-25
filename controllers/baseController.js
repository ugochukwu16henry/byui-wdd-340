// controllers/baseController.js
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/"); // Use forward slash for consistency

const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav(); // Await the getNav call
  res.render("index", { title: "Home", nav });
};

module.exports = baseController;
