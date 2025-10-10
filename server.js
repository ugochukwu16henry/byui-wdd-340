const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const pool = require("./database/");
const cookieParser = require("cookie-parser");
const app = express();

// Routes & Controllers
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const utilities = require("./utilities");

// ************************
// Middleware
// ************************

// Session setup
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

// Flash Messages Middleware
app.use(require("connect-flash")());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Parse URL-encoded and JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// JWT middleware
app.use(utilities.checkJWTToken);

// View Engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Static files
app.use(static);

// ************************
// Routes
// ************************
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute);

// ************************
// 404 Handler
// ************************
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

// ************************
// Express Error Handler
// ************************
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  const message =
    err.status === 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?";

  const errorViewPath = path.join(__dirname, "views", "errors", "error.ejs");
  const viewExists = fs.existsSync(errorViewPath);

  if (viewExists) {
    res.status(err.status || 500).render("errors/error", {
      title: err.status || "Server Error",
      message,
      nav,
    });
  } else {
    res.status(err.status || 500).send(`
      <h1>${err.status || "Server Error"}</h1>
      <p>${message}</p>
      <a href="/">Return Home</a>
    `);
  }
});

// Start server
const PORT = process.env.PORT || 550;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
