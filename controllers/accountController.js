const bcrypt = require("bcryptjs")
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")

async function buildLogin(req, res, next) {
  const nav = await utilities.getNav()
  res.render("account/login", { title: "Login", nav })
}

async function buildRegister(req, res, next) {
  const nav = await utilities.getNav()
  res.render("account/registration", { title: "Register", nav,
    errors: null,
    account_firstname: '',
    account_lastname: '',
    account_email: '',
    account_password: '',
   })
}

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
      account_firstname,
      account_lastname,
      account_email,
    });
  }

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

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
    res.status(201).render("account/login", { title: "Login", nav });
  } else {
    req.flash(
      "notice",
      "Registration failed. Please check your details and try again."
    );
    res
      .status(501)
      .render("account/registration", {
        title: "Register",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      });
  }
}

module.exports = { buildLogin, buildRegister, registerAccount }

