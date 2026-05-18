const apiKey =
"903dbc34862b4c14b0d170728261705";

/* =========================
   ELEMENTS
========================= */

const cityInput =
document.getElementById("city");

const weather =
document.getElementById("weather");

const loader =
document.getElementById("loader");

const alertBox =
document.getElementById("alert-box");

const searchBtn =
document.getElementById("search-btn");

const darkBtn =
document.getElementById("dark-btn");

let weatherChart;
let map;

/* =========================
   SEARCH
========================= */

searchBtn.addEventListener(
"click",
()=>{

searchWeather();

}
);

cityInput.addEventListener(
"keypress",
(e)=>{

if(e.key === "Enter"){

searchWeather();

}

}
);

function searchWeather(){

const city =
cityInput.value.trim();

if(city !== ""){

getWeather(city);

}

}

/* =========================
   DARK MODE FIX
========================= */

darkBtn.addEventListener(
"click",
()=>{

document.body.classList.toggle("dark");

/* Save Theme */

if(
document.body.classList.contains(
"dark"
)
){

localStorage.setItem(
"theme",
"dark"
);

darkBtn.innerHTML =
"☀ Light Mode";

}
else{

localStorage.setItem(
"theme",
"light"
);

darkBtn.innerHTML =
"🌙 Dark Mode";

}

}
);

/* Load Saved Theme */

window.addEventListener(
"load",
()=>{

const savedTheme =
localStorage.getItem("theme");

if(savedTheme === "dark"){

document.body.classList.add(
"dark"
);

darkBtn.innerHTML =
"☀ Light Mode";

}

}
);

/* =========================
   LOCATION
========================= */

document.getElementById(
"location-btn"
).addEventListener(
"click",
()=>{

navigator.geolocation
.getCurrentPosition(

(position)=>{

const lat =
position.coords.latitude;

const lon =
position.coords.longitude;

getWeather(`${lat},${lon}`);

},

()=>{

weather.innerHTML = `

<h2 style="color:red;">
📍 Location Access Denied
</h2>

`;

}

);

}
);

/* =========================
   GET WEATHER
========================= */

function getWeather(city){

showLoader();

weather.style.display = "none";

fetch(
`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=yes&alerts=yes`
)

.then(response=>response.json())

.then(data=>{

hideLoader();

if(data.error){

weather.style.display = "block";

weather.innerHTML = `

<h2 style="color:red;">
${data.error.message}
</h2>

`;

return;

}

showWeather(data);

})

.catch(error=>{

hideLoader();

console.log(error);

weather.style.display = "block";

weather.innerHTML = `

<h2 style="color:red;">
⚠ Failed to fetch weather
</h2>

`;

});

}

/* =========================
   LOADER
========================= */

function showLoader(){

loader.classList.remove(
"hidden"
);

searchBtn.disabled = true;

}

function hideLoader(){

loader.classList.add(
"hidden"
);

searchBtn.disabled = false;

}

/* =========================
   WEATHER THEME
========================= */

function setWeatherTheme(condition){

const app =
document.querySelector(".app");

condition =
condition.toLowerCase();

if(
condition.includes("sunny") ||
condition.includes("clear")
){

app.style.background =
"linear-gradient(135deg,#f6d365,#fda085)";

}

else if(
condition.includes("rain")
){

app.style.background =
"linear-gradient(135deg,#4b6cb7,#182848)";

}

else if(
condition.includes("cloud")
){

app.style.background =
"linear-gradient(135deg,#bdc3c7,#2c3e50)";

}

else{

app.style.background =
"rgba(255,255,255,0.08)";

}

}

/* =========================
   GREETING
========================= */

function getGreeting(){

const hour =
new Date().getHours();

if(hour < 12){

return "Good Morning ☀";

}

if(hour < 18){

return "Good Afternoon 🌤";

}

return "Good Evening 🌙";

}

/* =========================
   SHOW WEATHER
========================= */

function showWeather(data){

weather.style.display =
"block";

const current =
data.current;

const location =
data.location;

const forecast =
data.forecast.forecastday;

/* Theme */

setWeatherTheme(
current.condition.text
);

/* Alerts */

if(
data.alerts &&
data.alerts.alert &&
data.alerts.alert.length > 0
){

alertBox.classList.remove(
"hidden"
);

alertBox.innerHTML =
`⚠ ${data.alerts.alert[0].headline}`;

}
else{

alertBox.classList.add(
"hidden"
);

}

/* =========================
   WEATHER HTML
========================= */

weather.innerHTML = `

<div class="top">

<div>

<h2>
${getGreeting()}
</h2>

<h2>
${location.name},
${location.country}
</h2>

<p>
${location.localtime}
</p>

<div id="live-clock"></div>

<div class="temp">
${current.temp_c}°C
</div>

<div class="condition">
${current.condition.text}
</div>

</div>

<div class="main-icon">

<img
src="https:${current.condition.icon}">

</div>

</div>

<div class="grid">

<div class="card">
<h3>Feels Like</h3>
<p>${current.feelslike_c}°C</p>
</div>

<div class="card">
<h3>Humidity</h3>
<p>${current.humidity}%</p>
</div>

<div class="card">
<h3>Wind</h3>
<p>${current.wind_kph} KM/H</p>
</div>

<div class="card">
<h3>Pressure</h3>
<p>${current.pressure_mb} mb</p>
</div>

<div class="card">
<h3>UV Index</h3>
<p>${current.uv}</p>
</div>

<div class="card">
<h3>Visibility</h3>
<p>${current.vis_km} KM</p>
</div>

<div class="card">
<h3>Sunrise</h3>
<p>${forecast[0].astro.sunrise}</p>
</div>

<div class="card">
<h3>Sunset</h3>
<p>${forecast[0].astro.sunset}</p>
</div>

</div>

<h2 class="section-title">
⏰ Hourly Forecast
</h2>

<div
class="hourly-container"
id="hourly-container">
</div>

<h2 class="section-title">
📅 7 Day Forecast
</h2>

<div class="forecast-container">

${forecast.map(day=>`

<div class="forecast-card">

<h3>

${new Date(day.date)
.toLocaleDateString(
'en-US',
{weekday:'short'}
)}

</h3>

<img
src="https:${day.day.condition.icon}">

<p>
${day.day.avgtemp_c}°C
</p>

<p>
${day.day.condition.text}
</p>

</div>

`).join("")}

</div>

<h2 class="section-title">
📈 Temperature Analytics
</h2>

<canvas id="tempChart"></canvas>

<h2 class="section-title">
🗺 Live Weather Map
</h2>

<div id="map"></div>

`;

showHourly(
forecast[0].hour
);

createChart(
forecast
);

loadMap(
location.lat,
location.lon
);

}

/* =========================
   HOURLY FORECAST
========================= */

function showHourly(hourData){

const container =
document.getElementById(
"hourly-container"
);

container.innerHTML = "";

hourData
.slice(0,12)
.forEach(hour=>{

let time =
hour.time.split(" ")[1];

container.innerHTML += `

<div class="hour-card">

<h3>
${time}
</h3>

<img
src="https:${hour.condition.icon}">

<p>
${hour.temp_c}°C
</p>

<p>
💧 ${hour.chance_of_rain}%
</p>

</div>

`;

});

}

/* =========================
   CHART
========================= */

function createChart(forecast){

const labels =
forecast.map(day=>

new Date(day.date)
.toLocaleDateString(
'en-US',
{weekday:'short'}
)

);

const temps =
forecast.map(day=>
day.day.avgtemp_c
);

if(weatherChart){

weatherChart.destroy();

}

const ctx =
document.getElementById(
"tempChart"
).getContext("2d");

const textColor =
document.body.classList.contains(
"dark"
)
? "white"
: "#222";

weatherChart =
new Chart(ctx,{

type:'line',

data:{

labels:labels,

datasets:[{

label:'Temperature °C',

data:temps,

borderWidth:4,

tension:0.5,

fill:true,

pointRadius:6,

borderColor:"#00c6ff",

backgroundColor:
"rgba(0,198,255,0.2)"

}]

},

options:{

responsive:true,

plugins:{

legend:{

labels:{
color:textColor
}

}

},

scales:{

x:{

ticks:{
color:textColor
}

},

y:{

ticks:{
color:textColor
}

}

}

}

});

}

/* =========================
   MAP
========================= */

function loadMap(lat,lon){

if(map){

map.remove();

}

map =
L.map('map')
.setView([lat, lon], 10);

L.tileLayer(

'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

{
attribution:'© OpenStreetMap'
}

).addTo(map);

L.marker([lat, lon])

.addTo(map)

.bindPopup(
"📍 Weather Location"
)

.openPopup();

}

/* =========================
   LIVE CLOCK
========================= */

setInterval(()=>{

const clock =
document.getElementById(
"live-clock"
);

if(clock){

clock.innerHTML =
new Date()
.toLocaleTimeString();

}

},1000);

/* =========================
   AUTO LOAD
========================= */

window.onload = ()=>{

navigator.geolocation
.getCurrentPosition(

(position)=>{

const lat =
position.coords.latitude;

const lon =
position.coords.longitude;

getWeather(`${lat},${lon}`);

}

);

};
