const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Management view
router.get("/", invController.buildManagement);

// Add Classification
router.get("/add-classification", invController.buildAddClassification);
router.post("/add-classification", invController.addClassification);

// Add Inventory
router.get("/add-inventory", invController.buildAddInventory);
router.post("/add-inventory", invController.addInventory);

// Inventory by classification
router.get("/type/:classificationId", invController.buildByClassificationId);

// Inventory detail
router.get("/detail/:inv_id", invController.buildDetailView);

// Footer error test
router.get("/error-test", invController.triggerError);

module.exports = router;
