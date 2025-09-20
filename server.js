const inventoryRouter = require("./routes/inventoryRoute");

/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const path = require("path"); // ✅ FIX: import path
const app = express();
const static = require("./routes");
const routes = require("./routes");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public"))); // ✅ serve static files
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static);
app.use("/inv", inventoryRoute);
// Index

app.get("/", function (req, res) {
  res.render("index", { title: "Home" });
});

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// static
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// mount routes
app.use("/inventory", inventoryRouter);
app.use("/", miscRouter);

// ... other routers e.g., classifications, services, etc.
// e.g., app.use('/classifications', require('./routes/classifications'));

// 404 middleware
app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

// error handling middleware (must have 4 args)
app.use((err, req, res, next) => {
  // default status
  const status = err.status || 500;
  res.status(status);

  // log server side
  if (status === 500) {
    console.error(err.stack || err);
  }

  // render error view — pass error only when in dev
  res.render("error", {
    title: "Error",
    message: err.message,
    status,
    error: process.env.NODE_ENV === "development" ? err : null,
  });
});
/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  res.render("errors/error", {
    title: err.status || "Server Error",
    message: err.message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
const PORT = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
