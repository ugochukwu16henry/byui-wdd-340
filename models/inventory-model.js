// models/inventory-model.js
const pool = require("../database/");

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * *************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1",
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error);
  }
}

/* ***************************
 *  Get a single vehicle by id
 * *************************** */
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.inv_id = $1",
      [inv_id]
    );
    return data.rows[0]; // Assuming you only want one vehicle, return the first row
  } catch (error) {
    console.error("getVehicleById error: " + error);
  }
}

module.exports = {
  getInventoryByClassificationId,
  getVehicleById,
};
