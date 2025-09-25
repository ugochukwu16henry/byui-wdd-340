// server.js

// This MUST be the first line of code in this file
require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const baseController = require("./controllers/baseController");
const inventoryRoutes = require("./routes/inventory");
const intentionalErrorRoute = require("./routes/intentional-error");
const utilities = require("./utilities/");

const PORT = process.env.PORT || 5000;

// View Engine and Layouts setup
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // Default layout view

// Tell the app to use the static assets from the public folder
app.use(express.static("public"));

// Routes
// Home route
app.get("/", baseController.buildHome);
// Inventory routes
app.use("/inv", inventoryRoutes);
// Intentional error route
app.use(intentionalErrorRoute);

// Error handling middleware
// Error handling middleware should be the last app.use() in the stack
app.use(utilities.handleErrors);

// Start the server
app.listen(PORT, () => {
  console.log(`app listening on localhost:${PORT}`);
});
