const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const validate = require("../utilities/inventory-validation");

// Inventory management view (Secured)
router.get(
  "/",
  utilities.checkLogin,
  utilities.checkAuthorization,
  utilities.handleErrors(invController.buildManagement)
);

// Get inventory items by classification (Public)
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Get inventory item details (Public)
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildDetailView)
);

// Build add classification view (Secured)
router.get(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAuthorization,
  utilities.handleErrors(invController.buildAddClassification)
);

// Build add inventory view (Secured)
router.get(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAuthorization,
  utilities.handleErrors(invController.buildAddInventory)
);

// Build edit inventory view (Secured)
router.get(
  "/edit/:inv_id",
  utilities.checkLogin,
  utilities.checkAuthorization,
  utilities.handleErrors(invController.buildEditInventoryView)
);

// Update inventory data (Secured)
router.post(
  "/update/",
  utilities.checkLogin,
  utilities.checkAuthorization,
  validate.newInventoryRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Build delete confirmation view (Secured)
router.get(
  "/delete/:inv_id",
  utilities.checkLogin,
  utilities.checkAuthorization,
  utilities.handleErrors(invController.buildDeleteConfirm)
);

// Handle deletion of inventory data (Secured)
router.post(
  "/delete/",
  utilities.checkLogin,
  utilities.checkAuthorization,
  utilities.handleErrors(invController.deleteInventoryItem)
);

module.exports = router;
