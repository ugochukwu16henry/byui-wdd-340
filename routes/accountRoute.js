const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

// Public routes
router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
router.post("/register", accountController.registerAccount);
router.post("/login", accountController.accountLogin);

// Protected routes (requires JWT)
router.get(
  "/",
  utilities.checkJWTToken,
  accountController.buildAccountManagement
);

// Logout
router.get("/logout", accountController.logout);

module.exports = router;
