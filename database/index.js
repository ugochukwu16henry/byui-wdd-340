const { Pool } = require("pg");
require("dotenv").config();

let pool;

if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // needed for Render free Postgres
    },
  });
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      console.log("executed query:", text);
      return res;
    } catch (error) {
      console.error("error in query:", text, error);
      throw error;
    }
  },
};
