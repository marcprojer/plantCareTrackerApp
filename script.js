// URL of the backend API (adjust this based on your server setup)
const apiUrl = "http://localhost:3000/plants";

// Function to fetch and display the list of plants on the home page
async function fetchPlants() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const plants = await response.json();
    displayPlants(plants);
  } catch (error) {
    console.error("Error fetching plants:", error);
  }
}

// Function to display plants in the plant list section
function displayPlants(plants) {
  const plantList = document.getElementById("plant-list");
  plantList.innerHTML = ""; // Clear existing plant list

  plants.forEach((plant) => {
    const plantItem = document.createElement("div");
    plantItem.className = "plant-item";
    plantItem.innerHTML = `
            <h2>${plant.name}</h2>
            <p>Type: ${plant.type}</p>
            <p>Water Frequency: ${plant.water_frequency} days</p>
            <p>Last Watered: ${
              plant.last_watered ? plant.last_watered : "Not yet watered"
            }</p>
        `;
    plantList.appendChild(plantItem);
  });
}

// Function to handle the form submission for adding a new plant
document
  .getElementById("add-plant-form")
  ?.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const name = document.getElementById("name").value;
    const type = document.getElementById("type").value;
    const waterFrequency = document.getElementById("water-frequency").value;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          type,
          water_frequency: waterFrequency,
          last_watered: null, // Initially null, to be set later
        }),
      });

      if (response.ok) {
        alert("Plant added successfully!");
        document.getElementById("add-plant-form").reset(); // Reset form fields
      } else {
        throw new Error("Failed to add plant");
      }
    } catch (error) {
      console.error("Error adding plant:", error);
    }
  });

// Check if we are on the home page and fetch plants
if (document.getElementById("plant-list")) {
  fetchPlants();
}
