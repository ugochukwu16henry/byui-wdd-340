const express = require("express");
const router = new express.Router();
const inventoryController = require("../controllers/inventoryController");

// Route for classification view
router.get(
  "/type/:classificationId",
  inventoryController.buildByClassificationId
);

module.exports = router;
