const pool = require("../database/");

const favoriteModel = {};

/* =========================
   Add vehicle to favorites
========================= */
favoriteModel.addFavorite = async (account_id, inv_id) => {
  try {
    const sql = `
      INSERT INTO favorites (account_id, inv_id)
      VALUES ($1, $2)
      RETURNING *`;
    const result = await pool.query(sql, [account_id, inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error adding favorite:", error);
    return null;
  }
};

/* =========================
   Get all favorites for an account
========================= */
favoriteModel.getFavoritesByAccount = async (account_id) => {
  try {
    const sql = `
      SELECT f.favorite_id, i.inv_make, i.inv_model, i.inv_price, i.inv_image, i.inv_id
      FROM favorites f
      JOIN inventory i ON f.inv_id = i.inv_id
      WHERE f.account_id = $1
      ORDER BY f.favorite_id DESC`;
    const result = await pool.query(sql, [account_id]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};

/* =========================
   Remove vehicle from favorites
========================= */
favoriteModel.removeFavorite = async (favorite_id, account_id) => {
  try {
    const sql = `
      DELETE FROM favorites
      WHERE favorite_id = $1 AND account_id = $2
      RETURNING *`;
    const result = await pool.query(sql, [favorite_id, account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error removing favorite:", error);
    return null;
  }
};

module.exports = favoriteModel;
