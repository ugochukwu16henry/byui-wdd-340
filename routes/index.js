
const express = require("express")
const router = express.Router()
const baseController = require("../controllers/baseController")

// Define route
router.get("/intentional-error", (req, res, next) => {
    const err = new Error("Intentional server error for testing purposes");
    err.status = 500;
    next(err);
});
module.exports = router
