const pool = require("../database/");

// Get all vehicles in a classification
async function getInventoryByClassificationId(classification_id) {
  try {
    const result = await pool.query(
      `SELECT * FROM public.inventory 
       WHERE classification_id = $1 
       ORDER BY inv_make`,
      [classification_id]
    );
    return result.rows;
  } catch (err) {
    console.error("getInventoryByClassificationId error", err);
  }
}

// Get one vehicle by ID
async function getVehicleById(inv_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",
      [inv_id]
    );
    return result.rows[0];
  } catch (err) {
    console.error("getVehicleById error", err);
  }
}

module.exports = { getInventoryByClassificationId, getVehicleById };
