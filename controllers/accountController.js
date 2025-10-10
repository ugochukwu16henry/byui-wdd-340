const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ========== Render Login Page ========== */
async function buildLogin(req, res, next) {
  const nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email: "",
  });
}

/* ========== Render Registration Page ========== */
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

/* ========== Process Registration ========== */
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

/* ========== Process Login ========== */
async function accountLogin(req, res, next) {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  const accountData = await accountModel.getAccountByEmail(account_email);

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

  if (!isMatch) {
    req.flash("notice", "Invalid email or password.");
    return res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }

  delete accountData.account_password;

  const token = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 3600000, // 1 hour
  });

  req.flash("notice", `Welcome back, ${accountData.account_firstname}!`);
  return res.redirect("/account/");
}

/* ========== Account Management View ========== */
async function buildAccountManagement(req, res, next) {
  const nav = await utilities.getNav();
  const message = req.flash("notice") || null;
  const accountData = res.locals.accountData; // From JWT middleware

  res.render("account/management", {
    title: "Account Management",
    nav,
    message,
    account: accountData,
    errors: null,
  });
}

/* ========== Render Update Account View ========== */
async function buildUpdateAccount(req, res, next) {
  const nav = await utilities.getNav();
  const account_id = parseInt(req.params.id); // match route param
  const accountData = await accountModel.getAccountById(account_id);

  res.render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
    account: accountData,
  });
}

/* ========== Process Account Info Update ========== */
async function updateAccountInfo(req, res, next) {
  const nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;

  const updateResult = await accountModel.updateAccountInfo(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (updateResult) {
    req.flash("notice", "Account information updated successfully.");
    const accountData = await accountModel.getAccountById(account_id);
    return res.render("account/management", {
      title: "Account Management",
      nav,
      message: req.flash("notice"),
      account: accountData,
    });
  } else {
    req.flash("notice", "Update failed. Please try again.");
    return res.render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null,
      account: {
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      },
    });
  }
}

/* ========== Process Password Change ========== */
async function updatePassword(req, res, next) {
  const nav = await utilities.getNav();
  const { account_id, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const updateResult = await accountModel.updatePassword(
      account_id,
      hashedPassword
    );

    if (updateResult) {
      req.flash("notice", "Password updated successfully.");
      const accountData = await accountModel.getAccountById(account_id);
      return res.render("account/management", {
        title: "Account Management",
        nav,
        message: req.flash("notice"),
        account: accountData,
      });
    } else {
      req.flash("notice", "Password update failed.");
      return res.render("account/update", {
        title: "Update Account Information",
        nav,
        errors: null,
        account: { account_id },
      });
    }
  } catch (error) {
    console.error("Password update error:", error);
    req.flash("notice", "An error occurred while updating password.");
    res.redirect("/account/update/" + account_id);
  }
}

/* ========== Logout ========== */
async function logout(req, res, next) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out successfully.");
  res.redirect("/");
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildUpdateAccount,
  updateAccountInfo,
  updatePassword,
  logout,
};
