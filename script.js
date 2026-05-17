const apiKey =
"903dbc34862b4c14b0d170728261705";

const cityInput =
document.getElementById("city");

const weather =
document.getElementById("weather");

let weatherChart;
let map;

/* Search */

document.getElementById(
"search-btn"
).addEventListener("click",()=>{

if(cityInput.value.trim() !== ""){

getWeather(cityInput.value);

}

});

/* Enter Key */

cityInput.addEventListener(
"keypress",
(e)=>{

if(e.key === "Enter"){

getWeather(cityInput.value);

}

}
);

/* Dark Mode */

document.getElementById(
"dark-btn"
).addEventListener("click",()=>{

document.body.classList.toggle("dark");

});

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

}

);

});

/* Get Weather */

function getWeather(city){

weather.style.display = "block";

weather.innerHTML =
"<h2>Loading Weather...</h2>";

fetch(
`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=yes`
)

.then(response=>response.json())

.then(data=>{

console.log(data);

if(data.error){

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

console.log(error);

weather.innerHTML = `

<h2 style="color:red;">
Failed to fetch weather
</h2>

`;

});

}

/* Show Weather */

function showWeather(data){

const current =
data.current;

const location =
data.location;

const forecast =
data.forecast.forecastday;

/* Dynamic Background */

changeBackground(
current.condition.text
);

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

<img src="https:${current.condition.icon}">

</div>

</div>

<div class="grid">

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
<h3>Sunrise</h3>
<p>${forecast[0].astro.sunrise}</p>
</div>

<div class="card">
<h3>Sunset</h3>
<p>${forecast[0].astro.sunset}</p>
</div>

</div>

<h2 style="margin-top:35px;">
24 Hour Forecast
</h2>

<div
class="hourly-container"
id="hourly-container">
</div>

<h2 style="margin-top:35px;">
7 Day Forecast
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

<canvas id="tempChart"></canvas>

<h2 style="margin-top:35px;">
Live Weather Map
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

hourData.slice(0,24)
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
Rain:
${hour.chance_of_rain}%
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

weatherChart =
new Chart(

document.getElementById(
"tempChart"
),

{

type:'line',

data:{

labels:labels,

datasets:[{

label:'Temperature °C',

data:temps,

borderWidth:4,

tension:0.5,

fill:true

}]

},

options:{

responsive:true

}

}

);

}

/* Map */

function loadMap(lat,lon){

if(map){

map.remove();

}

map =
L.map('map')
.setView([lat, lon], 8);

L.tileLayer(

'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

{
attribution:'© OpenStreetMap'
}

).addTo(map);

L.marker([lat, lon])

.addTo(map)

.bindPopup("Weather Location")

.openPopup();

}

/* Dynamic Background */

function changeBackground(condition){

condition =
condition.toLowerCase();

if(condition.includes("rain")){

document.body.style.background =
"linear-gradient(to right,#4b79a1,#283e51)";

}

else if(condition.includes("cloud")){

document.body.style.background =
"linear-gradient(to right,#757f9a,#d7dde8)";

}

else if(condition.includes("clear")){

document.body.style.background =
"linear-gradient(to right,#56ccf2,#2f80ed)";

}

else{

document.body.style.background =
"linear-gradient(to right,#1d4350,#a43931)";

}

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
