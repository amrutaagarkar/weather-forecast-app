const apiKey = "deO8t2nbwpcWWvx2rW8xAVUf0A6dbAc6";

/* =========================
   GET WEATHER
========================= */

async function getWeather(defaultCity = null) {

  const cityInput = document.getElementById("city");

  const city = defaultCity || cityInput.value;

  if (!city) {
    alert("Enter city name");
    return;
  }

  try {

    /* REALTIME API */

    const realtimeURL =
      `https://api.tomorrow.io/v4/weather/realtime?location=${city}&apikey=${apiKey}`;

    const realtimeRes = await fetch(realtimeURL);

    const realtimeData = await realtimeRes.json();

    console.log(realtimeData);

    const values = realtimeData.data.values;

    document.getElementById("location").innerText =
      city;

    document.getElementById("temp").innerText =
      Math.round(values.temperature) + "°C";

    document.getElementById("desc").innerText =
      "Feels Like " +
      Math.round(values.temperatureApparent) +
      "°C";

    /* FORECAST API */

    const forecastURL =
      `https://api.tomorrow.io/v4/weather/forecast?location=${city}&apikey=${apiKey}`;

    const forecastRes = await fetch(forecastURL);

    const forecastData = await forecastRes.json();

    console.log(forecastData);

    const dailyData =
      forecastData.timelines.daily;

    showForecast(dailyData);

    /* WEATHER THEMES */

    setTheme(values.weatherCode);

  }

  catch (error) {

    console.log(error);

    alert("Weather data not found");

  }
}

/* =========================
   FORECAST
========================= */

function showForecast(days) {

  const forecast = document.getElementById("forecast");

  forecast.innerHTML = "";

  for (let i = 1; i <= 5; i++) {

    const item = days[i];

    const values = item.values;

    const date = new Date(item.time);

    const dayName =
      date.toLocaleDateString("en-US", {
        weekday: "short"
      });

    const card = document.createElement("div");

    card.classList.add("forecast-card");

    card.innerHTML = `
      <h3>${dayName}</h3>
      <p>🌡 ${Math.round(values.temperatureAvg)}°C</p>
      <p>💧 ${values.humidityAvg}%</p>
    `;

    forecast.appendChild(card);

  }
}

/* =========================
   WEATHER BACKGROUND
========================= */

function setTheme(code) {

  document.body.className = "";

  // Clear
  if (code === 1000) {

    document.body.classList.add("clear");

  }

  // Cloudy
  else if (code >= 1001 && code <= 1102) {

    document.body.classList.add("clouds");

  }

  // Rain
  else if (code >= 4000 && code < 5000) {

    document.body.classList.add("rainy");

    startRain();

  }

  // Snow
  else if (code >= 5000) {

    document.body.classList.add("snowy");

    startSnow();

  }

  // Mist
  else {

    document.body.classList.add("mist");

  }
}

/* =========================
   RAIN EFFECT
========================= */

function startRain() {

  for (let i = 0; i < 50; i++) {

    const rain = document.createElement("div");

    rain.classList.add("rain");

    rain.style.left =
      Math.random() * window.innerWidth + "px";

    rain.style.animationDuration =
      Math.random() * 1 + 0.5 + "s";

    document.body.appendChild(rain);

    setTimeout(() => {
      rain.remove();
    }, 2000);

  }
}

/* =========================
   SNOW EFFECT
========================= */

function startSnow() {

  for (let i = 0; i < 40; i++) {

    const snow = document.createElement("div");

    snow.classList.add("snow");

    snow.style.left =
      Math.random() * window.innerWidth + "px";

    document.body.appendChild(snow);

    setTimeout(() => {
      snow.remove();
    }, 3000);

  }
}

/* =========================
   ENTER KEY
========================= */

document
  .getElementById("city")
  .addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

      getWeather();

    }

  });

/* =========================
   AUTO LOAD
========================= */

window.onload = function () {

  getWeather("Pune");

};
