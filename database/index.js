const { Pool } = require("pg");
require("dotenv").config();

/* *************
 * Connection Pool
 * https://node-postgres.com/api/pool
 * NOTE: When connecting to a Render PostgreSQL database,
 * you will need to set the ssl option to true for production connections
 * ************ */
let pool;
if (process.env.NODE_ENV === "development") {
  // Development: local testing
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  // Production: Render
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

// Logs the connection to the database
if (process.env.NODE_ENV === "development") {
  pool.on("connect", () => {
    console.log("PostgreSQL connected (development)");
  });
}

module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      console.log("executed query", { text: text.slice(0, 100) });
      return res;
    } catch (error) {
      console.error("error in query", { text, error });
      throw error;
    }
  },
};
