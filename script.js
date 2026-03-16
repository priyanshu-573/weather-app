const apiKey = "8eaf15fff000fa7dd7f7aef623a7509b"; 
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const cityInput = document.getElementById("cityInput");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    const forecastResponse = await fetch(forecastUrl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        alert("City not found. Please try again.");
    } else {
        const data = await response.json();
        const forecastData = await forecastResponse.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " m/s";

        document.getElementById("mapFrame").src = `https://www.google.com/maps?q=${data.name}&output=embed`;

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

        displayHourlyForecast(forecastData);

        document.querySelector(".weather").style.display = "block";
    }
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
    checkWeather(cityInput.value);
}

// default city ------
checkWeather("Delhi");