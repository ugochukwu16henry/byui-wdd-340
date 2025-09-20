const pool = require("../database"); // adjust path if needed

/* Get all inventory items by classification_id */
async function getInventoryByClassificationId(classification_id) {
  try {
    const sql = `
      SELECT * 
      FROM inventory 
      WHERE classification_id = $1
      ORDER BY inv_make, inv_model
    `;
    const data = await pool.query(sql, [classification_id]);
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error", error);
    throw error;
  }
}

module.exports = { getInventoryByClassificationId };
