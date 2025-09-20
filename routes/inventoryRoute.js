const express = require("express");
const router = new express.Router();
const invController = require("../controllers/inventoryController");

// Route for classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

module.exports = router;
