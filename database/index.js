const { Pool } = require("pg");
// dotenv should be configured in server.js, so this is not needed here
// require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Your database connection string
    ssl: {
        rejectUnauthorized: false // This tells the pg library to accept the self-signed certificate
    }
});


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
