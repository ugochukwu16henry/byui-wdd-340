const pool = require("../database/");

async function getClassifications() {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    );
    return data.rows;
  } catch (error) {
    console.error("getClassifications error " + error);
    throw error;
  }
}

async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error);
    throw error;
  }
}

async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getVehicleById error " + error);
    throw error;
  }
}

// Add classification
async function addClassification(classification_name) {
  try {
    const result = await pool.query(
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *",
      [classification_name]
    );
    return result.rowCount > 0;
  } catch (error) {
    console.error("addClassification error " + error);
    throw error;
  }
}

// Add inventory
async function addInventory(
  inv_make,
  inv_model,
  inv_year,
  inv_price,
  inv_miles,
  inv_color,
  inv_description,
  inv_image,
  inv_thumbnail,
  classification_id
) {
  try {
    const result = await pool.query(
      `INSERT INTO public.inventory
      (inv_make, inv_model, inv_year, inv_price, inv_miles, inv_color, inv_description, inv_image, inv_thumbnail, classification_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`,
      [
        inv_make,
        inv_model,
        inv_year,
        inv_price,
        inv_miles,
        inv_color,
        inv_description,
        inv_image,
        inv_thumbnail,
        classification_id,
      ]
    );
    return result.rowCount > 0;
  } catch (error) {
    console.error("addInventory error " + error);
    throw error;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addInventory,
};
