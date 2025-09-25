// utilities/index.js
const invModel = require("../models/inventory-model");
const pool = require("../database/");

/* ****************************************
 *   Build the navigation menu
 * *************************************** */
async function getNav() {
  let data = await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
  let navList = "<ul>";
  navList += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    navList += "<li>";
    navList +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our ' +
      row.classification_name +
      ' vehicles">';
    navList += row.classification_name;
    navList += "</a>";
    navList += "</li>";
  });
  navList += "</ul>";
  return navList;
}

module.exports = {
  getNav,
  // ... other exported functions
};
