/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const path = require("path")   // ✅ FIX: import path
const app = express()
const static = require("./routes")
const routes = require("./routes");
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute");

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.use(express.static(path.join(__dirname, "public"))) // ✅ serve static files
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)
app.use("/inv", inventoryRoute);
// Index

app.get("/", function (req, res) {
  res.render("index", { title: "Home" })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
const PORT = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

