const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

// Route for classification view
router.get(
  "/type/:classificationId",
  inventoryController.buildByClassificationId
);

// Route for detail view
router.get("/detail/:inv_id", inventoryController.buildDetail);

module.exports = router;
