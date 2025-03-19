const apiKey = "353782a366122828867ed34191c27ddf";
const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const geoAPI = "https://api.openweathermap.org/geo/1.0/direct?q=";

const searchContainer = document.querySelector(".search");
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const suggestionsBox = document.createElement("ul");
suggestionsBox.classList.add("suggestions");
searchContainer.appendChild(suggestionsBox);

async function getCitySuggestions(query) {
    if (query.length < 3) {
        suggestionsBox.innerHTML = "";
        suggestionsBox.style.display = "none";
        return;
    }
    const response = await fetch(`${geoAPI}${query}&limit=5&appid=${apiKey}`);
    const data = await response.json();
    
    suggestionsBox.innerHTML = "";
    if (data.length > 0) {
        suggestionsBox.style.display = "block";
        data.forEach(city => {
            const listItem = document.createElement("li");
            listItem.textContent = `${city.name}, ${city.state || ''}, ${city.country}`.replace(/, ,/g, ',');
            listItem.addEventListener("click", () => {
                searchBox.value = city.name;
                suggestionsBox.innerHTML = "";
                suggestionsBox.style.display = "none";
                checkWeather(city.name);
            });
            suggestionsBox.appendChild(listItem);
        });
    } else {
        suggestionsBox.style.display = "none";
    }
}

async function checkWeather(city) {
    const response = await fetch(apiURL + city + `&appid=${apiKey}`);

    if (response.status === 404) {
        document.querySelector(".error").style.display = "block";
    } else {
        var data = await response.json();
        
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

        const weatherMap = {
            "Clouds": "cloudy.png",
            "Rain": "rainy.png",
            "Clear": "sunny.png",
            "Snow": "snow.png",
            "Thunderstorm": "thunderstorm.png",
            "Drizzle": "drizzle.png",
            "Mist": "mist.png",
            "Smoke": "smoke.png",
            "Haze": "haze.png",
            "Dust": "dust.png",
            "Fog": "fog.png",
            "Sand": "sand.png",
            "Tornado": "tornado.png"
        };

        weatherIcon.src = "images/" + (weatherMap[data.weather[0].main] || "default.png");
        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }
}

searchBox.addEventListener("input", () => {
    getCitySuggestions(searchBox.value);
});

searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        suggestionsBox.innerHTML = "";
        suggestionsBox.style.display = "none";
        checkWeather(searchBox.value);
    }
});

searchBtn.addEventListener("click", () => {
    suggestionsBox.innerHTML = "";
    suggestionsBox.style.display = "none";
    checkWeather(searchBox.value);
});