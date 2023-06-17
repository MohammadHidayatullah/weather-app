/** @format */

const timeEl = document.getElementById("time");
const timeMobileEl = document.getElementById("time-mobile");
const dateEl = document.getElementById("date");
const dateMobileEl = document.getElementById("date-mobile");
const timezone = document.getElementById("time-zone");
const timezoneMobile = document.getElementById("time-zone-mobile");
const countryEl = document.getElementById("country");
const countryMobileEl = document.getElementById("country-mobile");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");
const currentHumidityEl = document.getElementById("current-humidity");
const currentWindEl = document.getElementById("current-wind");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const API_KEY = "56a2c31c64a6247e0e851f88799c0dd5";

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;

  timeMobileEl.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;
    
    dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
    
    dateMobileEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

getWeatherData();
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        showWeatherData(data);
      });
  });
}

function showWeatherData(data) {
  let { humidity, pressure, temp, sunset, wind_speed, weather } = data.current;

  const tempInt = Math.round(temp);

  console.log("humidity", humidity);

  timezone.innerHTML = data.timezone;
  timezoneMobile.innerHTML = data.timezone;
  countryEl.innerHTML = data.lat + "N " + data.lon + "E";
  countryMobileEl.innerHTML = data.lat + "N " + data.lon + "E";

  currentTempEl.innerHTML = `
    <div class="label">
      <h5>Weather</h5>
      <p>What’s the weather</p>
    </div>
    <div class="img">
      <img src="http://openweathermap.org/img/wn//${weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
      </div>
    <div class="other">
      <div class="temp">${tempInt}&#176;C</div>
      <p class="weather">${weather[0].description}</p>
    </div>
    `;

  currentHumidityEl.innerHTML = `
  <div class="label">
    <h5>Humidity</h5>
    <p>Wetness of the atmosphere</p>
  </div>
  <div class="img">
    <img
      src="http://openweathermap.org/img/wn//${weather[0].icon}@4x.png" alt="weather icon" class="w-icon""
      alt="weather icon"
      class="w-icon"
    />
  </div>
  <div class="other">
    <div class="value">
      ${humidity}%
    </div>
    <p class="desc">${weather[0].description}</p>
  </div>
  `;

  currentWindEl.innerHTML = `
  <div class="label">
    <h5>Wind Speed</h5>
    <p>Speed of the wind</p>
  </div>
  <div class="img">
    <img
      src="http://openweathermap.org/img/wn//${weather[0].icon}@4x.png"
      alt="weather icon"
      class="w-icon"
    />
  </div>
  <div class="other">
    <div class="value">
      ${wind_speed}km/h
    </div>
    <p class="desc">${weather[0].description}</p>
  </div>
  `;

  let otherDayForcast = "";
  data.daily.forEach((day, idx) => {
    console.log("day", day);
    if (idx >= 1 && idx < 7) {
      otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("dddd")}</div>
                <img src="http://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" alt="weather icon" class="w-icon">
                <div class="temp"><span>Night</span><span>${Math.round(
                  day.temp.night
                )}&#176;C</span></div>
                <div class="temp"><span>Day</span><span>${Math.round(
                  day.temp.day
                )}&#176;C</span></div>
            </div>
            
            `;
    }
  });

  weatherForecastEl.innerHTML = otherDayForcast;
}
