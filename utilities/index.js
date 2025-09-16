// In utilities/index.js
const { Pool } = require("pg");
require("dotenv").config();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Utility functions
module.exports = {
  // Database utilities
  pool,
  query: (text, params) => pool.query(text, params),

  // Validation utilities
  validateInput: (input) => {
    // Basic validation logic
    return input && input.trim().length > 0;
  },

  // Error handling
  handleError: (res, error, message = "An error occurred") => {
    console.error(error);
    res.status(500).render("errors/error", {
      title: "Error",
      message: message,
    });
  },
};
