const apiKey = CONFIG.API_KEY;
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const cityInput = document.getElementById("cityInput");
const weatherIcon = document.querySelector(".weather-icon");
const loader = document.querySelector(".loader");
const weather = document.querySelector(".weather");
const locationBtn = document.getElementById('location')


const form = document.getElementById("searchForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    searchWeather();
});

locationBtn.addEventListener('click', (e) => {
    navigator.geolocation.getCurrentPosition(
        showPosition,
        (error) => {
            if(error.code === 1){
                alert('Permission denied');
            }else{
                alert('Unable to get Location');
            }
        }
    );
});

async function showPosition(position){
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    document.getElementById("mapFrame").src =
    `https://www.google.com/maps?q=${lat},${lon}&z=14&output=embed`;

    loader.style.display = "block";
    weather.style.display = "none";

    const data = await fetchWeatherByCoord(lat, lon);
    const forecastData = await fetchForecastByCoord(lat, lon);

    if (!data || !forecastData) {
    loader.style.display = "none";
    return;
}

     updateUI(data);
     displayHourlyForecast(forecastData);

    loader.style.display = "none";
    weather.style.display = "block";
}

async function fetchWeatherByCoord(lat, lon) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    if (!response.ok) {
        alert("Error fetching weather");
        return;
    }

    const data = await response.json();
    return data;
}

async function fetchForecastByCoord(lat, lon) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    if (!response.ok) {
        alert("Error fetching forecast");
        return;
    }

    const data = await response.json();
    return data;
}

async function fetchWeather(city) {
    
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    const forecastResponse = await fetch(forecastUrl + city + `&appid=${apiKey}`);

    if (!response.ok) {
        alert("City not found");
        return;
    }

    if (!forecastResponse.ok) {
    alert("Forecast error");
    return;
}

    const data = await response.json();
    const forecastData = await forecastResponse.json();
    return {data, forecastData};
}

async function checkWeather(city) {
    loader.style.display = "block";
    weather.style.display = "none";

    const result = await fetchWeather(city);

    if (!result || !result.data || !result.forecastData) {
    loader.style.display = "none";
    return;
}
const { data, forecastData } = result; 

    document.getElementById("mapFrame").src =
`https://maps.google.com/maps?q=${data.coord.lat},${data.coord.lon}&z=10&output=embed`;

    updateUI(data);
    displayHourlyForecast(forecastData);

    loader.style.display = "none";
    weather.style.display = "block";

}
    
    
        function updateUI(data) {
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " m/s";

    const condition = data.weather[0].main;

    if (condition == "Clouds") {
        weatherIcon.src = "images/clouds.png";
    } else if (condition == "Clear") {
        weatherIcon.src = "images/clear.png";
    } else if (condition == "Rain") {
        weatherIcon.src = "images/rain.png";
    } else if (condition == "Drizzle") {
        weatherIcon.src = "images/drizzle.png";
    } else if (condition == "Mist" || condition == "Haze") {
        weatherIcon.src = "images/mist.png";
    } else {
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    }
    cityInput.value=""
        }

        
function displayHourlyForecast(data) {
    const hourlyContainer = document.querySelector(".hourly-forecast");
    hourlyContainer.innerHTML = ""; 

    for (let i = 0; i < 8; i++) {
        const item = data.list[i];
        const time = new Date(item.dt * 1000).getHours();
        const ampm = time >= 12 ? 'PM' : 'AM';
        const displayTime = `${time % 12 || 12}${ampm}`;
        
        hourlyContainer.innerHTML += `
            <div class="hourly-item">
                <p>${displayTime}</p>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
                <p>${Math.round(item.main.temp)}°C</p>
            </div>
        `;
    }
}


function searchWeather() {
    const city = cityInput.value.trim();

    if(!city){
        alert("Enter a city name");
        return;
    }
    checkWeather(city);
}

// default city ------
checkWeather("Delhi");