// routes/inventory.js
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory detail view
router.get("/detail/:inv_id", invController.buildDetail);

module.exports = router;
