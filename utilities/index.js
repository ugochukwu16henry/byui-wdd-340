const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Get navigation data
async function getNav() {
  try {
	const data = await pool.query('SELECT * FROM public.classification ORDER BY classification_name');
	return data.rows;
  } catch (error) {
	console.error('getNav error: ' + error);
	return [];
  }
}

module.exports = {
  getNav,
  pool,
  query: (text, params) => pool.query(text, params)
};