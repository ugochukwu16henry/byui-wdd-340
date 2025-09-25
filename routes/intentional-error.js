// routes/intentional-error.js
const express = require("express");
const router = express.Router();

router.get("/trigger-500", (req, res, next) => {
  try {
    throw new Error("This is an intentional 500 server error.");
  } catch (err) {
    next(err); // Pass the error to the middleware
  }
});

module.exports = router;
