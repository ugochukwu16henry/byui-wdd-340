const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController"); // Create this controller

// Route to build inventory items by classification
router.get("/type/:typeId", invController.buildByClassificationId);

module.exports = router;
