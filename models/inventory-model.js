const pool = require("../database/");

async function getInventoryByClassificationId(classification_id) {
  try {
    const result = await pool.query(
      `SELECT * 
       FROM inventory 
       JOIN classification 
       ON inventory.classification_id = classification.classification_id
       WHERE inventory.classification_id = $1`,
      [classification_id]
    );
    return result.rows;
  } catch (error) {
    console.error("DB Error:", error);
  }
}

async function getInventoryDetailById(inv_id) {
  try {
    const result = await pool.query(
      `SELECT * FROM inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("DB Error:", error);
  }
}

module.exports = { getInventoryByClassificationId, getInventoryDetailById };
