// This MUST be the first line of code in this file
require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const staticRoutes = require("./routes/static"); // Import the router
const inventoryRoutes = require("./routes/inventory");
// app.js
// ... other requires and app setup
const utilities = require("./utilities");

// ... your routes
app.use(utilities.handleErrors); // <-- This should be at the end, after all other routes

// app.js
// ... other requires
const intentionalErrorRoute = require("./routes/intentional-error");

// ... your other routes
app.use(intentionalErrorRoute);
app.use(utilities.handleErrors);


const PORT = process.env.PORT || 5000;

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");
app.use(express.static("public"));

// Tell the app to use the staticRoutes router for requests to the root path
app.use("/", staticRoutes);
app.use("/inv", inventoryRoutes);

app.listen(PORT, () => {
  console.log(`app listening on localhost:${PORT}`);
});
