const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

// Route to show cars by classification
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to show individual car details
router.get("/detail/:invId", invController.buildDetailById);

module.exports = router;
