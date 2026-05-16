const apiKey = "YOUR_API_KEY";

const geoAPI = "https://api.openweathermap.org/geo/1.0/direct";
const oneCallAPI = "https://api.openweathermap.org/data/3.0/onecall";

let input = document.getElementById("input-box");

input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        getWeather(input.value);
    }
});

async function getWeather(city) {
    try {

        // STEP 1: GET LAT & LON
        let geoRes = await fetch(`${geoAPI}?q=${city}&limit=1&appid=${apiKey}`);
        let geoData = await geoRes.json();

        if (!geoData.length) {
            swal("Error", "City not found", "error");
            return;
        }

        let lat = geoData[0].lat;
        let lon = geoData[0].lon;

        // STEP 2: GET WEATHER DATA (CURRENT + 7 DAYS)
        let weatherRes = await fetch(
            `${oneCallAPI}?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${apiKey}`
        );

        let data = await weatherRes.json();

        displayWeather(data, geoData[0].name);

    } catch (error) {
        console.log(error);
    }
}

function displayWeather(data, city) {

    let current = data.current;

    let html = `
        <div class="weather-card">
            <h2>${city}</h2>
            <h1>${Math.round(current.temp)}°C</h1>
            <p>${current.weather[0].main}</p>
            <p>Feels like: ${Math.round(current.feels_like)}°C</p>
        </div>

        <h3>7-Day Forecast</h3>

        <div class="forecast">
    `;

    data.daily.slice(0, 7).forEach((day, index) => {
        let date = new Date(day.dt * 1000).toDateString();

        html += `
            <div class="day">
                <b>${date.split(" ")[0]}</b>
                <p>${Math.round(day.temp.day)}°C</p>
                <small>${day.weather[0].main}</small>
            </div>
        `;
    });

    html += `</div>`;

    document.getElementById("weather-body").innerHTML = html;
}
