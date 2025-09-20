const express = require("express");
const router = new express.Router();
const inventoryController = require("../controllers/inventoryController");
const app = express()
// other middleware here...
// bring in the inventory routes
const inventoryRoute = require("../routes/inventoryRoute")
app.use("/inv", inventoryRoute)  // 👈 this is important
// Route for classification view
router.get(
  "/type/:classificationId",
  inventoryController.buildByClassificationId
);
module.exports = router;
