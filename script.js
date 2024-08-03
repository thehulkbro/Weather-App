document.getElementById('fetchDataButton').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  displayMap(lat, lon);
  fetchWeatherData(lat, lon);
  switchToWeatherPage();
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}

function initMap() {
  // This function needs to exist for the callback parameter in the script tag, but it does nothing here
}

function displayMap(lat, lon) {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: lat, lng: lon },
    zoom: 12,
  });
  new google.maps.Marker({
    position: { lat: lat, lng: lon },
    map: map,
  });
}

async function fetchWeatherData(lat, lon) {
  const apiKey = '18a7da888d4a98d3e1faa18fa8e915a1';
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${apiKey}`;

  try {
    console.log(`Fetching weather data from URL: ${url}`); // Debug line
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const weatherData = await response.json();
    displayWeatherData(weatherData);
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    alert("Failed to fetch weather data.");
  }
}

function displayWeatherData(data) {
  console.log('Weather Data:', data); // Debug line
  document.getElementById('location').innerText = `Location: ${data.timezone}`;
  document.getElementById('temperature').innerText = `Temperature: ${(data.current.temp - 273.15).toFixed(2)}°C`;
  document.getElementById('humidity').innerText = `Humidity: ${data.current.humidity}%`;
  document.getElementById('windSpeed').innerText = `Wind Speed: ${data.current.wind_speed} m/s`;
  document.getElementById('uvIndex').innerText = `UV Index: ${data.current.uvi}`;
  document.getElementById('pressure').innerText = `Pressure: ${data.current.pressure} hPa`;
  document.getElementById('windDirection').innerText = `Wind Direction: ${data.current.wind_deg}°`;
}

function switchToWeatherPage() {
  document.getElementById('landingPage').classList.remove('active');
  document.getElementById('weatherPage').classList.add('active');
}
