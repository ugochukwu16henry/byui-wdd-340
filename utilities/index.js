// utilities/index.js
async function buildClassificationGrid(data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid += `<a href="/inventory/detail/${vehicle.inv_id}" title="View details for ${vehicle.inv_make} ${vehicle.inv_model}">`;
      grid += `<img src="${vehicle.inv_thumbnail}" alt="${vehicle.inv_make} ${vehicle.inv_model} on-screen">`;
      grid += "</a>";
      // ... rest of the list item
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
}

// utilities/index.js
// ... other functions

/* ****************************************
* Express Error Handling Middleware
* *************************************** */
const handleErrors = async (err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging
    res.status(500).render('errors/error', {
      title: 'Server Error',
      message: 'A server error occurred. Please try again later.',
      status: 500,
      nav: await getNav(), // Make sure your layout can handle `nav`
    });
  };

module.exports = {
    // ... other utility functions
    handleErrors,
};

