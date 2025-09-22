const pool = require("../database");

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

/* Get single vehicle by inv_id */
async function getVehicleById(inv_id) {
  try {
    const sql = `SELECT * FROM inventory WHERE inv_id = $1`;
    const data = await pool.query(sql, [inv_id]);
    return data.rows[0];
  } catch (error) {
    console.error("getVehicleById error", error);
    throw error;
  }
}

module.exports = { getInventoryByClassificationId, getVehicleById };
