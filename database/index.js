const { Pool } = require("pg");
require("dotenv").config();

let pool;

if (process.env.NODE_ENV === "development") {
  // Development: local testing
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  });

  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params);
        console.log("executed query", { text });
        return res;
      } catch (error) {
        console.error("error in query", { text, error });
        throw error;
      }
    },
  };
} else {
  // Production: Render
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params);
        console.log("executed query", { text });
        return res;
      } catch (error) {
        console.error("error in query", { text, error });
        throw error;
      }
    },
  };
}
