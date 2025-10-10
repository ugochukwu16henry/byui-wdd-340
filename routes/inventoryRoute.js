const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const validate = require("../utilities/inventory-validation");

// Route to build inventory management view
// Secured: Requires login and Admin/Employee authorization
router.get(
  "/",
  utilities.checkLogin,
  utilities.checkAuthorization,
  utilities.handleErrors(invController.buildManagement)
);

// Route to get inventory items for a classification (Public)
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to get inventory item details (Public)
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInventoryId)
);

// Route to build add classification view
// Secured: Requires login and Admin/Employee authorization
router.get(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAuthorization,
  utilities.handleErrors(invController.buildAddClassification)
);

// Route to build add inventory view
// Secured: Requires login and Admin/Employee authorization
router.get(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAuthorization,
  utilities.handleErrors(invController.buildAddInventory)
);

// Route to build edit inventory view
// Secured: Requires login and Admin/Employee authorization
router.get(
  "/edit/:inv_id",
  utilities.checkLogin,
  utilities.checkAuthorization,
  utilities.handleErrors(invController.buildEditView)
);

// Route to update inventory data
// Secured: Requires login and Admin/Employee authorization
router.post(
  "/update/",
  utilities.checkLogin,
  utilities.checkAuthorization,
  validate.newInventoryRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Route to build the delete confirmation view
// Secured: Requires login and Admin/Employee authorization
router.get(
  "/delete/:inv_id",
  utilities.checkLogin,
  utilities.checkAuthorization,
  utilities.handleErrors(invController.buildDeleteConfirm)
);

// Route to handle the actual deletion of inventory data
// Secured: Requires login and Admin/Employee authorization
router.post(
  "/delete/",
  utilities.checkLogin,
  utilities.checkAuthorization,
  utilities.handleErrors(invController.deleteInventoryItem)
);

module.exports = router;
