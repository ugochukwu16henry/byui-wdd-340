const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
const Util = {};

/**
 * Build navigation bar dynamically
 */
Util.getNav = async function () {
  // NOTE: This assumes invModel.getClassifications now returns the full data object
  const data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';

  // check for data and data.rows to prevent the 'forEach' error.
  if (data && data.rows && data.rows.length > 0) {
    data.rows.forEach((row) => {
      list += "<li>";
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>";
      list += "</li>";
    });
  } else {
    // Optional: Log an error if the navigation data is missing
    console.error("Warning: Could not load classifications for navigation.");
  }

  list += "</ul>";
  return list;
};

/* ****************************************
 * Build Classification Drop-down List
 * Pass the classification_id for 'sticky' selection
 **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  // NOTE: This assumes invModel.getClassifications now returns the full data object
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";

  // Add check to ensure data exists before looping
  if (data && data.rows && data.rows.length > 0) {
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"';

      // Check if this option should be 'selected'
      if (
        classification_id != null &&
        row.classification_id == row.classification_id
      ) {
        classificationList += " selected ";
      }
      classificationList += ">" + row.classification_name + "</option>";
    });
  } else {
    console.error("Warning: Could not load classifications for list.");
  }

  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * Build Inventory Grid view
 * **************************************** */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no vehicles could be found.</p>';
  }
  return grid;
};

/* ****************************************
 * Error Handler Wrapper
 * Use this to wrap route controller functions
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/* ****************************************
 * Middleware to check JWT and attach account data
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    // A token exists, so attempt to verify it
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
      if (err) {
        // Token is invalid (expired, tampered, etc.)
        console.error("JWT verification error:", err.message);
        res.clearCookie("jwt"); // Clear the bad cookie
        // Redirect and RETURN to prevent any further processing in this request
        return res.redirect("/account/login");
      }

      // Token is valid. Attach data to locals for use in views/controllers.
      res.locals.accountData = accountData;
      res.locals.loggedin = true;
      next();
    });
  } else {
    // No token exists. Ensure loggedin is explicitly set to false for views.
    res.locals.loggedin = false;
    next();
  }
};

/* ****************************************
 * Middleware to check login status (secure route gate)
 **************************************** */
Util.checkLogin = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
    if (err) {
      console.error("JWT verify failed:", err);
      res.clearCookie("jwt");
      req.flash("notice", "Session expired. Please log in again.");
      return res.redirect("/account/login");
    }

    res.locals.accountData = accountData;
    res.locals.loggedin = true;
    next();
  });
};

/* ****************************************
 * Middleware to check account type authorization (NEW)
 * (Requires checkJWTToken or checkLogin to run first)
 **************************************** */
Util.checkAuthorization = (req, res, next) => {
  // Check if user is logged in AND if the account type is Admin or Employee
  if (
    res.locals.loggedin &&
    (res.locals.accountData.account_type === "Admin" ||
      res.locals.accountData.account_type === "Employee")
  ) {
    next();
  } else {
    // User is not authorized
    req.flash(
      "notice",
      "You do not have the necessary permissions to access the Inventory Management Area."
    );
    // Force a redirect to login, even if they were technically logged in as a 'Client'
    res.redirect("/account/login");
  }
};

module.exports = Util;
