// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/:inv_id, type/:classificationId", invController.buildByClassificationId, invController.showInventoryDetail);

module.exports = router;