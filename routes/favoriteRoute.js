const express = require("express");
const router = new express.Router();
const favoriteController = require("../controllers/favoriteController");
const utilities = require("../utilities/");

// ===== Protected Favorites Routes =====
router.get("/", utilities.checkJWTToken, favoriteController.buildFavoritesView);
router.post("/add", utilities.checkJWTToken, favoriteController.addFavorite);
router.get(
  "/remove/:favorite_id",
  utilities.checkJWTToken,
  favoriteController.removeFavorite
);

module.exports = router;
