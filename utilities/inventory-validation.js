const utilities = require("./index");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");

const validate = {};

/* **********************************
 * New Classification Data Validation Rules
 * ********************************* */
validate.newClassificationRules = () => {
  return [
    // classification_name is required and cannot contain spaces or special characters
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Classification name is required.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage(
        "Classification name must contain only letters and numbers, with no spaces."
      ),
  ];
};

/* **********************************
 * Check data and return errors or continue to add classification
 * ********************************* */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors: errors,
      title: "Add New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/* **********************************
 * New Inventory Data Validation Rules (Task 3)
 * ********************************* */
validate.newInventoryRules = () => {
  return [
    // classification_id must be a valid ID
    body("classification_id")
      .trim()
      .isInt({ min: 1 })
      .withMessage("Classification is required."),

    // inv_make is required and must not be empty
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Make is required (minimum 3 characters)."),

    // inv_model is required and must not be empty
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Model is required (minimum 3 characters)."),

    // inv_year must be a 4-digit number
    body("inv_year")
      .trim()
      .isNumeric()
      .withMessage("Year must be a number.")
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be a 4-digit number."),

    // inv_description is required
    body("inv_description")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Description is required."),

    // inv_image must be a valid path
    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Image path is required.")
      .matches(/^\/.+\.(jpg|jpeg|png|webp|gif)$/i)
      .withMessage("Image path must be valid (e.g., /images/test.jpg)."),

    // inv_thumbnail must be a valid path
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Thumbnail path is required.")
      .matches(/^\/.+\.(jpg|jpeg|png|webp|gif)$/i)
      .withMessage("Thumbnail path must be valid (e.g., /images/test-tn.jpg)."),

    // inv_price must be a decimal/float
    body("inv_price")
      .trim()
      .isNumeric()
      .withMessage("Price must be a valid decimal number (e.g., 999.99).")
      .custom((value) => value > 0)
      .withMessage("Price must be greater than zero."),

    // inv_miles must be an integer
    body("inv_miles")
      .trim()
      .isInt({ min: 0 })
      .withMessage("Mileage must be a non-negative integer."),

    // inv_color is required
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Color is required."),
  ];
};

/* **********************************
 * Check data and return errors or continue to add inventory
 * ********************************* */
validate.checkInventoryData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(
      classification_id
    ); // Build sticky list

    // Rerender the form with sticky data and errors
    res.render("inventory/add-inventory", {
      errors: errors,
      title: "Add New Inventory",
      nav,
      classificationList,
      // All req.body values passed back for stickiness
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
    return;
  }
  next();
};

/* **********************************
 * Check data and return errors or continue to update inventory
 * NOTE: The checkUpdateData middleware is needed to redirect back to the
 * *edit-inventory* view instead of *add-inventory* on error.
 * ********************************* */
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationSelect = await utilities.buildClassificationList(
      classification_id
    ); // Build sticky list

    // Rerender the *edit* form with sticky data and errors
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Please fix the errors below.");
    res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: errors,
      // All req.body values passed back for stickiness
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
    return;
  }
  next();
};

module.exports = validate;
