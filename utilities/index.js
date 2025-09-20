const Intl = global.Intl;

// I Created Util object if it doesn't exist
const Util = {};

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});
/**
 * Format number as USD currency (e.g. $25,000)
 */
function formatUSD(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

/**
 * Format integer with commas for miles
 */
function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Takes vehicle object and returns HTML string for detail content
 * @param {Object} vehicle
 * @returns {string}
 */
function buildVehicleDetailHTML(vehicle) {
  if (!vehicle) return '<p>Vehicle not found.</p>';

  const price = formatUSD(vehicle.inv_price);
  const miles = formatNumber(vehicle.inv_miles);

  // Use the full image (inv_image) per requirement
  return `
    <article class="vehicle-detail">
      <h1 class="sr-only">${vehicle.inv_make} ${vehicle.inv_model} ${vehicle.inv_year}</h1>
      <div class="vehicle-detail__grid">
        <div class="vehicle-detail__image">
          <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}" loading="lazy" />
        </div>
        <div class="vehicle-detail__info">
          <h2>${vehicle.inv_make} ${vehicle.inv_model} <span class="muted">(${vehicle.inv_year})</span></h2>
          <p class="price">${price}</p>
          <ul class="meta">
            <li><strong>Color:</strong> ${vehicle.inv_color}</li>
            <li><strong>Mileage:</strong> ${miles} miles</li>
          </ul>
          <div class="description">
            <h3>Overview</h3>
            <p>${vehicle.inv_description}</p>
          </div>
        </div>
      </div>
    </article>
  `;
}

// Get navigation data - REPLACE THIS SECTION
async function getNav() {
  let client;
  try {
    client = await pool.connect();
    const data = await client.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    );
    return data.rows;
  } catch (error) {
    console.error("getNav error: " + error.message);
    // Return static fallback data
    return [
      { classification_name: "Home", classification_id: 1, nav_link: "/" },
      {
        classification_name: "Inventory",
        classification_id: 2,
        nav_link: "/inventory",
      },
      {
        classification_name: "About",
        classification_id: 3,
        nav_link: "/about",
      },
    ];
  } finally {
    if (client) {
      client.release();
    }
  }
}

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid = "";
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

module.exports = {
  getNav,
  pool,
  query: (text, params) => pool.query(text, params),
  Util,
  buildVehicleDetailHTML,
  formatUSD,
  formatNumber,
};
