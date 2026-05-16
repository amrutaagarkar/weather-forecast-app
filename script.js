const apiKey =
"deO8t2nbwpcWWvx2rW8xAVUf0A6dbAc6";

/* GET WEATHER */

async function getWeather(defaultCity=null){

  const cityInput =
    document.getElementById("city");

  const city =
    defaultCity || cityInput.value;

  if(!city){
    alert("Please enter city");
    return;
  }

  try{

    /* REALTIME */

    const realtimeURL =
    `https://api.tomorrow.io/v4/weather/realtime?location=${city}&apikey=${apiKey}`;

    const realtimeRes =
      await fetch(realtimeURL);

    const realtimeData =
      await realtimeRes.json();

    console.log(realtimeData);

    const values =
      realtimeData.data.values;

    const temp =
      Math.round(values.temperature);

    const feels =
      Math.round(values.temperatureApparent);

    const humidity =
      Math.round(values.humidity);

    const wind =
      Math.round(values.windSpeed);

    const code =
      values.weatherCode;

    /* UPDATE UI */

    document.getElementById("location")
    .innerText = city;

    document.getElementById("temp")
    .innerText = temp + "°C";

    document.getElementById("desc")
    .innerText =
      "Feels Like " + feels + "°C";

    document.getElementById("humidity")
    .innerText = humidity + "%";

    document.getElementById("wind")
    .innerText = wind + " km/h";

    /* FORECAST */

    const forecastURL =
    `https://api.tomorrow.io/v4/weather/forecast?location=${city}&apikey=${apiKey}`;

    const forecastRes =
      await fetch(forecastURL);

    const forecastData =
      await forecastRes.json();

    console.log(forecastData);

    const daily =
      forecastData.timelines.daily;

    showForecast(daily);

    /* BACKGROUND */

    setTheme(code);

  }

  catch(error){

    console.log(error);

    alert("Weather not found");

  }

}

/* FORECAST */

function showForecast(days){

  const forecast =
    document.getElementById("forecast");

  forecast.innerHTML = "";

  for(let i=1;i<=7;i++){

    const item = days[i];

    const values = item.values;

    const date =
      new Date(item.time);

    const day =
      date.toLocaleDateString(
        "en-US",
        {weekday:"short"}
      );

    const card =
      document.createElement("div");

    card.classList.add("forecast-card");

    card.innerHTML = `
      <h3>${day}</h3>

      <p>🌡 ${Math.round(values.temperatureAvg)}°C</p>

      <p>💧 ${Math.round(values.humidityAvg)}%</p>

      <p>🌧 ${Math.round(values.precipitationProbabilityAvg)}%</p>
    `;

    forecast.appendChild(card);

  }

}

/* THEMES */

function setTheme(code){

  document.body.className = "";

  /* CLEAR */

  if(code === 1000){

    document.body.classList.add("clear");

  }

  /* CLOUDS */

  else if(
    code >= 1001 &&
    code <= 1102
  ){

    document.body.classList.add("clouds");

  }

  /* RAIN */

  else if(
    code >= 4000 &&
    code < 5000
  ){

    document.body.classList.add("rainy");

    startRain();

  }

  /* SNOW */

  else if(code >= 5000){

    document.body.classList.add("snowy");

    startSnow();

  }

  /* DEFAULT */

  else{

    document.body.classList.add("mist");

  }

}

/* RAIN EFFECT */

function startRain(){

  for(let i=0;i<50;i++){

    const rain =
      document.createElement("div");

    rain.classList.add("rain");

    rain.style.left =
      Math.random() * window.innerWidth + "px";

    rain.style.animationDuration =
      Math.random() * 1 + 0.5 + "s";

    document.body.appendChild(rain);

    setTimeout(()=>{
      rain.remove();
    },2000);

  }

}

/* SNOW EFFECT */

function startSnow(){

  for(let i=0;i<40;i++){

    const snow =
      document.createElement("div");

    snow.classList.add("snow");

    snow.style.left =
      Math.random() * window.innerWidth + "px";

    document.body.appendChild(snow);

    setTimeout(()=>{
      snow.remove();
    },3000);

  }

}

/* ENTER KEY */

document
.getElementById("city")
.addEventListener("keypress",function(e){

  if(e.key === "Enter"){

    getWeather();

  }

});

/* AUTO LOAD */

window.onload = function(){

  getWeather("Pune");

};
