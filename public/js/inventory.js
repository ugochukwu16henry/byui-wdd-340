"use strict";

// The entire script is wrapped in an event listener that waits for the DOM to load.
document.addEventListener("DOMContentLoaded", function () {
  // Get a list of items based on classification_id
  let classificationList = document.querySelector("#classificationList");

  // Check if the classificationList element actually exists before trying to add a listener
  if (classificationList) {
    classificationList.addEventListener("change", function () {
      let classification_id = classificationList.value;
      console.log(`classification_id is: ${classification_id}`);
      // FIX: Updated the URL path to /inv/type/ to match the server route
      let classIdURL = "/inv/type/" + classification_id;

      fetch(classIdURL)
        .then(function (response) {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then(function (data) {
          console.log(data);
          buildInventoryList(data);
        })
        .catch(function (error) {
          console.log("There was a problem: ", error.message);
        });
    });
  }
});

// Build inventory items into HTML table components
function buildInventoryList(data) {
  let inventoryDisplay = document.getElementById("inventoryDisplay");
  // Set up the table labels
  let dataTable = "<thead>";
  dataTable += "<tr><th>Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>";
  dataTable += "</thead>";
  // Set up the table body
  dataTable += "<tbody>";
  // Iterate over all vehicles in the array and put the data into the table
  data.forEach(function (element) {
    console.log(element.inv_id + ", " + element.inv_model);
    dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
    // Add the Edit link
    dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`;
    // ADD THE NEW DELETE LINK (This part is correct)
    // This links to the buildDeleteConfirm controller function
    dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td>`;
    dataTable += "</tr>";
  });
  dataTable += "</tbody>";
  // Display the contents in the Inventory Management view
  inventoryDisplay.innerHTML = dataTable;
}
