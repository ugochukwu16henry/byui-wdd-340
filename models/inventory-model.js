const pool = require("../database")

/**************************
 * Get all classification data
 */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/**
 * Get a single inventory item by inv_id (parameterized for safety)
 * @param {number} invId
 * @returns {Promise<Object|null>}
 */
async function getInventoryByClassificationId(invId) {
  const sql = `
    SELECT
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
      classification_id
    FROM public.inventory
    WHERE inv_id = $1
    LIMIT 1;
  `;

  const params = [invId];

  try {
    const result = await db.query(sql, params);
    if (result.rows.length) {
      return result.rows[0];
    }
    return null;
  } catch (err) {
    // bubble up the error to controller to be handled by middleware
    throw err;
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */


module.exports = { getClassifications, getInventoryByClassificationId };
