const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  const nav = await utilities.getNav();
  res.render("account/login", { title: "Login", nav });
}

/* ****************************************
 * Deliver registration view
 *****************************************/
async function buildRegister(req, res, next) {
  const nav = await utilities.getNav();
  res.render("account/registration", {
    title: "Register",
    nav,
    errors: null,
    account_firstname: "",
    account_lastname: "",
    account_email: "",
    account_password: "",
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res, next) {
  const nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Simple validation
  if (
    !account_firstname ||
    !account_lastname ||
    !account_email ||
    !account_password
  ) {
    req.flash("notice", "All fields are required.");
    return res.render("account/registration", {
      title: "Register",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      errors: null,
    });
  }

  try {
    // ✅ Hash password inside the function
    const hashedPassword = bcrypt.hashSync(account_password, 10);

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, ${account_firstname}, you're registered! Please log in.`
      );
      return res.status(201).render("account/login", { title: "Login", nav });
    }
  } catch (error) {
    console.error("Registration error:", error);
    req.flash(
      "notice",
      "Registration failed. Please check your details and try again."
    );
  }

  res.status(501).render("account/registration", {
    title: "Register",
    nav,
    account_firstname,
    account_lastname,
    account_email,
    errors: null,
  });
}

module.exports = { buildLogin, buildRegister, registerAccount };
