// Needed Resources
const express = require("express");
const router =  express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/inventory", invController.buildInventory, invController.showInventoryDetail);

module.exports = router;