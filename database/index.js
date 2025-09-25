const { Pool } = require("pg");
// dotenv should be configured in server.js, so this is not needed here
// require("dotenv").config();

let pool;

/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * if-else determines which to use
 * *************** */
if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

// Export a single object with a query function
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      console.log("executed query", { text });
      return res;
    } catch (error) {
      console.error("error in query", { text });
      throw error;
    }
  },
};
