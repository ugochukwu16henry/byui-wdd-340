// server.js

// This MUST be the first line of code in this file
require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();

// Controllers & Routes
const baseController = require("./controllers/baseController");
const inventoryRoutes = require("./routes/inventory");
const intentionalErrorRoute = require("./routes/intentional-error"); // <-- Must export a router
const utilities = require("./utilities/");

const PORT = process.env.PORT || 5000;

// View Engine and Layouts setup
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // Default layout view

// Middleware to parse requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static assets
app.use(express.static("public"));

// Home route
app.get("/", baseController.buildHome);

// Inventory routes
app.use("/inv", inventoryRoutes);

// Intentional error route (prefix path for clarity)
app.use("/error", intentionalErrorRoute);

// Error handling middleware (must be last)
app.use(utilities.handleErrors);

// Start server
app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});
