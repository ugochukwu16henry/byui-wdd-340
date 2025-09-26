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
  const nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  if (!account_firstname || !account_lastname || !account_email || !account_password) {
    req.flash("notice", "All fields are required.")
    return res.render("account/registration", { title: "Register", nav, account_firstname, account_lastname, account_email })
  }

  const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, account_password)

  if (regResult) {
    req.flash("notice", `Congratulations, ${account_firstname}, you're registered! Please log in.`)
    res.status(201).render("account/login", { title: "Login", nav })
  } else {
    req.flash("notice", "Registration failed. Please check your details and try again.")
    res.status(501).render("account/registration", { title: "Register", nav, account_firstname, account_lastname, account_email })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount }

