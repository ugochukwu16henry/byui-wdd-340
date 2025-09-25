// routes/inventory.js
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// ... your route definitions
// Example: router.get("/detail/:inv_id", invController.buildDetail);

module.exports = router; // Ensure this line is present
