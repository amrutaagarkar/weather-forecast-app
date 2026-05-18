const apiKey =
"903dbc34862b4c14b0d170728261705";

/* Elements */

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

saveSearch(city);

getWeather(city);

}

}

/* =========================
   DARK MODE
========================= */
document.getElementById(
"dark-btn"
).addEventListener(
"click",
()=>{

document.body.classList.toggle("dark");

/* Reapply weather theme */

const condition =
document.querySelector(".condition");

if(condition){

setWeatherTheme(
condition.innerText
);

}

}
);


/* Auto Dark Mode */

const hour =
new Date().getHours();

if(hour >= 18 || hour <= 6){

document.body.classList.add("dark");

}

/* =========================
   LOCATION
========================= */

document.getElementById(
"location-btn"
).addEventListener(
"click",
()=>{

navigator.geolocation.getCurrentPosition(

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

<div class="error-box">

<h2>
⚠ Network Error
</h2>

<p>
Please check your internet connection
</p>

<button onclick="searchWeather()">
Retry
</button>

</div>

`;

});

}

/* =========================
   LOADER
========================= */

function showLoader(){

loader.classList.remove("hidden");

searchBtn.disabled = true;

}

function hideLoader(){

loader.classList.add("hidden");

searchBtn.disabled = false;

}

/* =========================
   WEATHER THEME
========================= */

function setWeatherTheme(condition){

/* STOP if dark mode is active */

if(document.body.classList.contains("dark")){

document.body.style.background =
"linear-gradient(135deg,#000000,#121212,#1f1f1f)";

return;

}

condition = condition.toLowerCase();

/* Sunny */

if(
condition.includes("sunny") ||
condition.includes("clear")
){

document.body.style.background =
"linear-gradient(135deg,#f6d365,#fda085)";

}

/* Rain */

else if(condition.includes("rain")){

document.body.style.background =
"linear-gradient(135deg,#4b6cb7,#182848)";

}

/* Clouds */

else if(condition.includes("cloud")){

document.body.style.background =
"linear-gradient(135deg,#bdc3c7,#2c3e50)";

}

/* Snow */

else if(condition.includes("snow")){

document.body.style.background =
"linear-gradient(135deg,#e6dada,#274046)";

}

/* Default */

else{

document.body.style.background =
"linear-gradient(135deg,#4facfe,#00f2fe)";

}

}

/* =========================
   AQI STATUS
========================= */

function getAQIStatus(pm){

if(pm <= 12){
return "Good";
}

if(pm <= 35){
return "Moderate";
}

if(pm <= 55){
return "Unhealthy";
}

return "Hazardous";

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
   WEATHER WARNINGS
========================= */

function checkWeatherWarnings(current){

/* Extreme Heat */

if(current.temp_c >= 40){

showCustomAlert(
"🔥 Extreme Heat Warning"
);

showDeviceNotification(
"Weather Alert",
"🔥 Extreme Heat Warning"
);

}

/* High UV */

if(current.uv >= 8){

showCustomAlert(
"☀ Very High UV Index"
);

showDeviceNotification(
"Weather Alert",
"☀ Very High UV Index"
);

}

/* Strong Wind */

if(current.wind_kph >= 50){

showCustomAlert(
"🌪 Strong Wind Alert"
);

showDeviceNotification(
"Weather Alert",
"🌪 Strong Wind Expected"
);

}

}
/* =========================
   SHOW WEATHER
========================= */

function showWeather(data){

weather.style.display = "block";

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

/* Save Last City */

localStorage.setItem(
"lastCity",
location.name
);

/* Alerts */

if(
data.alerts &&
data.alerts.alert &&
data.alerts.alert.length > 0
){

alertBox.classList.remove("hidden");

alertBox.innerHTML =
`⚠ ${data.alerts.alert[0].headline}`;

}

else{

alertBox.classList.add("hidden");

}

/* Weather Warnings */

checkWeatherWarnings(current);

/* Weather HTML */

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
<h3>Wind Direction</h3>
<p>${current.wind_dir}</p>
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

<div class="card">
<h3>Air Quality</h3>
<p>
${Math.round(current.air_quality.pm2_5)}
-
${getAQIStatus(
current.air_quality.pm2_5
)}
</p>
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

${forecast.map((day,index)=>`

<div
class="forecast-card"
data-index="${index}"
>

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

/* Functions */

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

/* Forecast Details */

document
.querySelectorAll(".forecast-card")
.forEach((card,index)=>{

card.addEventListener(
"click",
()=>{

const day =
forecast[index];

alert(`

Date: ${day.date}

Condition:
${day.day.condition.text}

Humidity:
${day.day.avghumidity}%

Rain Chance:
${day.day.daily_chance_of_rain}%

Max Temp:
${day.day.maxtemp_c}°C

Min Temp:
${day.day.mintemp_c}°C

`);

}
);

});

/* Smooth Scroll */

weather.scrollIntoView({

behavior:"smooth"

});

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
   TEMP COLOR
========================= */

function getTempColor(temp){

if(temp <= 10){

return "#00b4db";

}

if(temp <= 25){

return "#00c853";

}

if(temp <= 35){

return "#ff9800";

}

return "#ff1744";

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

const gradient =
ctx.createLinearGradient(0,0,0,400);

gradient.addColorStop(
0,
"rgba(0,150,255,0.7)"
);

gradient.addColorStop(
1,
"rgba(0,150,255,0)"
);

const lineColor =
getTempColor(
Math.max(...temps)
);

const textColor =
document.body.classList.contains("dark")
? "white"
: "black";

weatherChart =
new Chart(ctx,{

type:'line',

data:{

labels:labels,

datasets:[{

label:'Temperature °C',

data:temps,

borderColor:lineColor,

borderWidth:4,

tension:0.5,

fill:true,

backgroundColor:gradient,

pointRadius:6

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

.bindPopup("📍 Weather Location")

.openPopup();

}

/* =========================
   SEARCH HISTORY
========================= */

function saveSearch(city){

let history =
JSON.parse(
localStorage.getItem("history")
) || [];

if(!history.includes(city)){

history.unshift(city);

}

history = history.slice(0,5);

localStorage.setItem(
"history",
JSON.stringify(history)
);

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
   AUTO REFRESH
========================= */

setInterval(()=>{

const currentCity =
localStorage.getItem(
"lastCity"
);

if(currentCity){

getWeather(currentCity);

}

},300000);

/* =========================
   AUTO LOAD
========================= */

/* =========================
   DEVICE NOTIFICATIONS
========================= */

function requestNotificationPermission(){

if("Notification" in window){

Notification.requestPermission();

}

}

function showDeviceNotification(title,message){

if(Notification.permission === "granted"){

new Notification(title,{

body:message,

icon:"https://cdn-icons-png.flaticon.com/512/1779/1779940.png"

});

}

}

/* =========================
   AUTO LOAD
========================= */

window.onload = ()=>{

requestNotificationPermission();

const savedCity =
localStorage.getItem(
"lastCity"
);

if(savedCity){

getWeather(savedCity);

}

else{

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

}

};
