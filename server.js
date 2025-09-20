/******************************************
 * server.js - Main entry point
 ******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const path = require("path");

// Routers
const baseController = require("./controllers/baseController");
const inventoryRouter = require("./routes/inventoryRoute");
// If you have a misc router, uncomment the next line and make sure the file exists
// const miscRouter = require("./routes/miscRoute")

const app = express();

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root
app.set("views", path.join(__dirname, "views"));

/* ***********************
 * Middleware
 *************************/
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ***********************
 * Routes
 *************************/
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// Routers
app.use("/inventory", inventoryRouter);
app.use("/inv", inventoryRouter);
// app.use("/", miscRouter) // enable when miscRouter is defined

/* ***********************
 * 404 Handler
 *************************/
app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

/* ***********************
 * Error Handler
 *************************/
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status);

  if (status === 500) {
    console.error(err.stack || err);
  }

  res.render("error", {
    title: "Error",
    message: err.message,
    status,
    error: process.env.NODE_ENV === "development" ? err : null,
  });
});

/* ***********************
 * Server Listener
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});
