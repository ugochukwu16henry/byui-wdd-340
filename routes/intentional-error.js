// routes/intentional-error.js
const express = require("express");
const router = express.Router();

// A route to intentionally trigger an error
router.get("/", (req, res, next) => {
  next(new Error("Intentional error for testing purposes"));
});

module.exports = router;
