// index.js

const weatherApi = "https://api.weather.gov/alerts/active?area=";

const stateInput = document.getElementById("state-input");
const fetchButton = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorElement = document.getElementById("error-message");

// Display an error message
function displayError(message) {
  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
  errorElement.classList.add("error");
}

// Clear previous errors
function clearError() {
  errorElement.textContent = "";
  errorElement.classList.add("hidden");
  errorElement.classList.remove("error");
}

// Fetch weather alerts for a state
async function fetchWeatherAlerts() {
  const state = stateInput.value.trim().toUpperCase();

  // Clear input and previous alerts
  stateInput.value = "";
  alertsDisplay.innerHTML = "";

  try {
    // Validate the state abbreviation
    if (!/^[A-Z]{2}$/.test(state)) {
      throw new Error("Please enter a valid two-letter state abbreviation.");
    }

    // Show loading message
    alertsDisplay.textContent = "Loading weather alerts...";
    fetchButton.disabled = true;

    const response = await fetch(`${weatherApi}${state}`);

    // Check for HTTP errors
    if (!response.ok) {
      throw new Error(`Failed to fetch weather alerts: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();
    // Clear previous alerts
    alertsDisplay.innerHTML = "";

    // Display title and number of alerts
    const heading = document.createElement("h2");
    heading.textContent = `${data.title}: ${data.features.length}`;
    alertsDisplay.appendChild(heading);

    // Create a list of alert headlines
    const alertList = document.createElement("ul");

    data.features.forEach((alert) => {
      const listItem = document.createElement("li");
      listItem.textContent = alert.properties.headline;
      alertList.appendChild(listItem);
    });

    alertsDisplay.appendChild(alertList);

    // Clear any previous error on success
    clearError();

  } catch (errorObject) {
    alertsDisplay.innerHTML = "";
    displayError(errorObject.message);
  } finally {
    fetchButton.disabled = false;
  }
}

// Listen for button clicks
fetchButton.addEventListener("click", fetchWeatherAlerts);

// Allow the Enter key to submit
stateInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    fetchWeatherAlerts();
  }
});

