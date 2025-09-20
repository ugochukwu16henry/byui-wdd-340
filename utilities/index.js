// Build classification grid
function buildClassificationGrid(data) {
  let grid = '<ul id="inv-display">';
  data.forEach((vehicle) => {
    grid += `<li>
      <a href="/inventory/detail/${vehicle.inv_id}" title="View ${
      vehicle.inv_make
    } ${vehicle.inv_model}">
        <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${
      vehicle.inv_model
    }">
      </a>
      <div class="namePrice">
        <h2><a href="/inventory/detail/${vehicle.inv_id}">${vehicle.inv_make} ${
      vehicle.inv_model
    }</a></h2>
        <span>$${new Intl.NumberFormat().format(vehicle.inv_price)}</span>
      </div>
    </li>`;
  });
  grid += "</ul>";
  return grid;
}

// Build vehicle detail page
function buildVehicleDetail(vehicle) {
  return `
    <section class="vehicle-detail">
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${
    vehicle.inv_model
  }">
      <div class="vehicle-info">
        <h2>${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})</h2>
        <p><strong>Price:</strong> $${new Intl.NumberFormat().format(
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
}

module.exports = { buildClassificationGrid, buildVehicleDetail };
