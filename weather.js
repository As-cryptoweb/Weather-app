
const apiKey = 'f9494748924d0d62a948d69540834059';

// DOM Elements
const locationInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('searchBtn');
const currentLocationBtn = document.getElementById('currentLocationBtn');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const forecast = document.getElementById('forecast');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');

// Fetch Weather Data by City Name
async function fetchWeatherByCity(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    if (!response.ok) throw new Error('City not found');
    const data = await response.json();
    updateCurrentWeather(data);
    fetchForecast(data.coord.lat, data.coord.lon); // Fetch 5-day forecast
  } catch (error) {
    alert(error.message);
  }
}

// Fetch Weather Data by Current Location
async function fetchWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    if (!response.ok) throw new Error('Unable to fetch data');
    const data = await response.json();
    updateCurrentWeather(data);
    fetchForecast(lat, lon); // Fetch 5-day forecast
  } catch (error) {
    alert(error.message);
  }
}

// Fetch 5-Day Forecast
async function fetchForecast(lat, lon) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    const data = await response.json();
    updateForecast(data.list);
  } catch (error) {
    console.error('Error fetching forecast:', error);
  }
}

// Update Current Weather Details
function updateCurrentWeather(data) {
  temperature.textContent = data.main.temp;
  condition.textContent = data.weather[0].description;
  humidity.textContent = data.main.humidity;
  windSpeed.textContent = data.wind.speed;

  const sunriseTime = new Date(data.sys.sunrise * 1000);
  const sunsetTime = new Date(data.sys.sunset * 1000);

  sunrise.textContent = sunriseTime.toLocaleTimeString();
  sunset.textContent = sunsetTime.toLocaleTimeString();
}

// Update 5-Day Forecast
function updateForecast(forecastData) {
  forecast.innerHTML = ''; // Clear previous forecast
  forecastData.forEach((entry, index) => {
    if (index % 8 === 0) { // Every 8th data point corresponds to a day
      const date = new Date(entry.dt * 1000).toLocaleDateString();
      const temp = entry.main.temp;
      const weather = entry.weather[0].description;

      const forecastItem = document.createElement('div');
      forecastItem.classList.add('forecast-item');
      forecastItem.innerHTML = `
        <p>Date: ${date}</p>
        <p>Temp: ${temp}°C</p>
        <p>Condition: ${weather}</p>
      `;
      forecast.appendChild(forecastItem);
    }
  });
}

// Get Current Location
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    }, (error) => {
      alert('Unable to fetch location. Please enable location services.');
    });
  } else {
    alert('Geolocation is not supported by your browser.');
  }
}

// Event Listeners
searchBtn.addEventListener('click', () => {
  const city = locationInput.value.trim();
  if (city) fetchWeatherByCity(city);
});

currentLocationBtn.addEventListener('click', getCurrentLocation);
