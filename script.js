const apiKey = "9b14b2cbfdfa41f6b63172731261605";

/* ---------- NOTIFICATION PERMISSION ---------- */
Notification.requestPermission();

/* ---------- MAP ---------- */
let map = L.map("map").setView([20,78], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

let marker;

/* ---------- SEARCH ---------- */
document.getElementById("search").onclick = () => {
getWeather(city.value);
};

document.getElementById("geo").onclick = () => {
navigator.geolocation.getCurrentPosition(pos=>{
getWeather(`${pos.coords.latitude},${pos.coords.longitude}`);
});
};

document.getElementById("dark").onclick = () => {
document.body.classList.toggle("dark");
};

/* ---------- FETCH WEATHER ---------- */
async function getWeather(city){

const res = await fetch(
`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=yes`
);

const data = await res.json();
show(data);
}

/* ---------- SHOW WEATHER ---------- */
function show(data){

const c = data.current;
const l = data.location;
const f = data.forecast.forecastday;

document.getElementById("map").style.display="block";

document.getElementById("weather").innerHTML = `
<h2>${l.name}, ${l.country}</h2>
<h1>${c.temp_c}°C</h1>
<p>${c.condition.text}</p>

<div class="card">Humidity: ${c.humidity}%</div>
<div class="card">Wind: ${c.wind_kph} km/h</div>
<div class="card">Pressure: ${c.pressure_mb}</div>
`;

/* MAP */
map.setView([l.lat, l.lon], 10);

if(marker) map.removeLayer(marker);

marker = L.marker([l.lat, l.lon])
.addTo(map)
.bindPopup(l.name)
.openPopup();

/* ALERT SYSTEM */
checkAlerts(c);

/* CHART */
chart(f);
}

/* ---------- WEATHER ALERTS (PUSH) ---------- */
function checkAlerts(c){

const text = c.condition.text.toLowerCase();

if(text.includes("rain")){
sendNotification("🌧️ Rain Alert","Rain expected in your area");
}

if(text.includes("storm") || text.includes("thunder")){
sendNotification("⛈️ Storm Alert","Thunderstorm incoming");
}

if(c.temp_c > 38){
sendNotification("🔥 Heat Alert","Very high temperature today");
}
}

/* ---------- PUSH NOTIFICATION ---------- */
function sendNotification(title, body){

if(Notification.permission !== "granted"){
Notification.requestPermission();
return;
}

if("serviceWorker" in navigator){
navigator.serviceWorker.ready.then(reg=>{
reg.showNotification(title,{
body:body,
vibrate:[200,100,200]
});
});
}
}

/* ---------- CHART ---------- */
function chart(f){

new Chart(document.getElementById("chart"),{
type:"line",
data:{
labels:f.map(x=>x.date),
datasets:[{
label:"Temp",
data:f.map(x=>x.day.avgtemp_c),
borderWidth:3,
tension:0.4
}]
},
options:{plugins:{legend:{display:false}}}
});

}
