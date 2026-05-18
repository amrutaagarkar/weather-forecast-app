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

let weatherChart;
let map;

/* Search */

document.getElementById(
"search-btn"
).addEventListener("click",()=>{

searchWeather();

});

/* Enter Key */

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

/* Dark Mode */

document.getElementById(
"dark-btn"
).addEventListener("click",()=>{

document.body.classList.toggle("dark");

});

/* Auto Dark Mode */

const hour =
new Date().getHours();

if(hour >= 18 || hour <= 6){

document.body.classList.add("dark");

}

/* My Location */

document.getElementById(
"location-btn"
).addEventListener("click",()=>{

navigator.geolocation.getCurrentPosition(

(position)=>{

const lat =
position.coords.latitude;

const lon =
position.coords.longitude;

getWeather(`${lat},${lon}`);

},

()=>{

alert("Location access denied");

}

);

});

/* Get Weather */

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
Failed to fetch weather
</h2>

`;

});

}

/* Loader */

function showLoader(){

loader.classList.remove("hidden");

}

function hideLoader(){

loader.classList.add("hidden");

}

/* Show Weather */

function showWeather(data){

weather.style.display = "block";

const current =
data.current;

const location =
data.location;

const forecast =
data.forecast.forecastday;

/* Alerts */

if(data.alerts.alert.length > 0){

alertBox.classList.remove("hidden");

alertBox.innerHTML =
`⚠ ${data.alerts.alert[0].headline}`;

}

else{

alertBox.classList.add("hidden");

}

/* Weather HTML */

weather.innerHTML = `

<div class="top">

<div>

<h2>
${location.name},
${location.country}
</h2>

<p>
${location.localtime}
</p>

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

<div class="card">
<h3>Air Quality</h3>
<p>${Math.round(current.air_quality.pm2_5)}</p>
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

/* Hourly Forecast */

function showHourly(hourData){

const container =
document.getElementById(
"hourly-container"
);

container.innerHTML = "";

hourData.forEach(hour=>{

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

/* Chart */

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

backgroundColor:gradient,

pointRadius:6

}]

},

options:{

responsive:true,

plugins:{

legend:{

labels:{
color:"white"
}

}

},

scales:{

x:{

ticks:{
color:"white"
}

},

y:{

ticks:{
color:"white"
}

}

}

}

});

}

/* Map */

function loadMap(lat,lon){

if(map){

map.remove();

}

map =
L.map('map')
.setView([lat, lon], 7);

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

/* Auto Load */

window.onload = ()=>{

navigator.geolocation.getCurrentPosition(

(position)=>{

const lat =
position.coords.latitude;

const lon =
position.coords.longitude;

getWeather(`${lat},${lon}`);

}

);

};
