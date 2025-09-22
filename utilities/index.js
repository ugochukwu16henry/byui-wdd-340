// utilities/index.js

const utilities = {};

// Build the nav
utilities.getNav = async function () {
  try {
    return `
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/inv/type/1">Custom</a></li>
          <li><a href="/inv/type/2">Sedan</a></li>
          <li><a href="/inv/type/3">Sport</a></li>
          <li><a href="/inv/type/4">SUV</a></li>
          <li><a href="/inv/type/5">Truck</a></li>
        </ul>
      </nav>
    `;
  } catch (error) {
    console.error("Error building nav:", error);
    throw error;
  }
};

// Build classification grid
utilities.buildClassificationGrid = function (data) {
  let grid = '<ul id="inv-display">';
  data.forEach((vehicle) => {
    grid += `<li>
      <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${
      vehicle.inv_model
    }">
        <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${
      vehicle.inv_model
    }">
      </a>
      <div class="namePrice">
        <h2><a href="/inv/detail/${vehicle.inv_id}">${vehicle.inv_make} ${
      vehicle.inv_model
    }</a></h2>
        <span>$${new Intl.NumberFormat().format(vehicle.inv_price)}</span>
      </div>
    </li>`;
  });
  grid += "</ul>";
  return grid;
};

// Build vehicle detail page
utilities.buildVehicleDetail = function (vehicle) {
  return `
    <section class="vehicle-detail__grid">
      <div class="vehicle-detail__image">
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${
    vehicle.inv_model
  }">
      </div>
      <div class="vehicle-detail__info">
        <h2>${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})</h2>
        <p class="price">$${new Intl.NumberFormat().format(
          vehicle.inv_price
        )}</p>
        <p><strong>Mileage:</strong> ${new Intl.NumberFormat().format(
          vehicle.inv_miles
        )} miles</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p>${vehicle.inv_description}</p>
      </div>
    </section>
  `;
};

module.exports = utilities;
