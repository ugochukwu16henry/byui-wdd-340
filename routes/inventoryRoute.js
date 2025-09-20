// Needed Resources
const express = require("express");
const router =  express.Router();
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)
// Show a single vehicle by detail
router.get("/detail/:invId', invController.buildDetailView")
module.exports = router;