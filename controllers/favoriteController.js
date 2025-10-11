const favoriteModel = require("../models/favorite-model");
const utilities = require("../utilities/");

/* ====================================
 *  Add a vehicle to favorites
 * ==================================== */
async function addFavorite(req, res, next) {
  try {
    const { inv_id } = req.body;
    const account_id = res.locals.accountData.account_id;

    const result = await favoriteModel.addFavorite(account_id, inv_id);

    if (result) {
      req.flash("success", "Vehicle added to favorites!");
    } else {
      req.flash("notice", "Could not add vehicle to favorites.");
    }
    res.redirect("/favorites");
  } catch (error) {
    console.error("Add favorite error:", error);
    next(error);
  }
}

/* ====================================
 *  Display all user favorites
 * ==================================== */
async function buildFavoritesView(req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id;
    const favorites = await favoriteModel.getFavoritesByAccount(account_id);

    const nav = await utilities.getNav();
    res.render("favorites/view", {
      title: "My Favorites",
      nav,
      favorites,
      messages: req.flash(),
    });
  } catch (error) {
    console.error("Build favorites view error:", error);
    next(error);
  }
}

/* ====================================
 *  Remove a vehicle from favorites
 * ==================================== */
async function removeFavorite(req, res, next) {
  try {
    const favorite_id = req.params.favorite_id;
    const account_id = res.locals.accountData.account_id;

    const result = await favoriteModel.removeFavorite(favorite_id, account_id);

    if (result) {
      req.flash("success", "Vehicle removed from favorites.");
    } else {
      req.flash("notice", "Could not remove vehicle from favorites.");
    }

    res.redirect("/favorites");
  } catch (error) {
    console.error("Remove favorite error:", error);
    next(error);
  }
}

module.exports = {
  addFavorite,
  buildFavoritesView,
  removeFavorite,
};
