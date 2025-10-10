const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Render login page
async function buildLogin(req, res, next) {
  const nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email: "",
  });
}

// Render registration page
async function buildRegister(req, res, next) {
  const nav = await utilities.getNav();
  res.render("account/registration", {
    title: "Register",
    nav,
    errors: null,
    account_firstname: "",
    account_lastname: "",
    account_email: "",
  });
}

// Process registration
async function registerAccount(req, res, next) {
  const nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

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
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    });
  }

  try {
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
        `Congratulations, ${account_firstname}, you’re registered! Please log in.`
      );
      return res.redirect("/account/login");
    } else {
      req.flash("notice", "Registration failed; email may already be in use.");
      return res.render("account/registration", {
        title: "Register",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("notice", "Registration issue; try again later.");
    return res.render("account/registration", {
      title: "Register",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

// Process login
async function accountLogin(req, res, next) {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  // ⬅️ DEBUG LOG 0: Check the incoming email from the form
  console.log("Incoming Login Email:", account_email);

  const accountData = await accountModel.getAccountByEmail(account_email);

  // ⬅️ DEBUG LOG 1: Check database retrieval
  console.log("Account Data Retrieved:", accountData);

  if (!accountData) {
    req.flash("notice", "Invalid email or password.");
    return res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }

  const isMatch = await bcrypt.compare(
    account_password,
    accountData.account_password
  );

  // ⬅️ DEBUG LOG 2: Check password comparison
  console.log("Password Match Result (True/False):", isMatch);

  if (!isMatch) {
    req.flash("notice", "Invalid email or password.");
    return res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }

  // --- Login Success Logic (Original Code) ---

  delete accountData.account_password;

  // Sign JWT
  const token = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  // Set cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 3600000, // 1 hour
  });

  req.flash("notice", `Welcome back, ${accountData.account_firstname}!`);
  return res.redirect("/account/");
}

// Render Account Management (Protected)
async function buildAccountManagement(req, res, next) {
  const nav = await utilities.getNav();
  const message = req.flash("notice") || null;
  res.render("account/management", {
    title: "Account Management",
    nav,
    message,
    errors: null,
  });
}

// Logout
async function logout(req, res, next) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out successfully.");
  res.redirect("/account/login");
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  logout,
};
