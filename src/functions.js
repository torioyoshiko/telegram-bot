import fetch from 'node-fetch';
import { DateTime } from "luxon";

const weatherKey = process.env.WEATHER_KEY;

export const noYouDontWantTo = (str) => {
  const re = new RegExp(/Дед,(.*) ли мне (.*)\?/i);
  const words = str.match(re);

  if (words[2] === 'я') {
    words[2] = 'ты';
  }

  return `Тебе ${words[2]} не${words[1]}`;
};

export const yesYouWantTo = (str) => {
  const re = new RegExp(/Дед,(.*) ли мне (.*)\?/i);
  const words = str.match(re);

  if (words[2] === 'я') {
    words[2] = 'ты';
  }

  return `Тебе ${words[2]}${words[1]}`;
};

export const thisOrThisFirst = (str) => {
  const re = new RegExp(/Дед, (.*) или (.*)\?/i);
  const words = str.match(re);

  return words[1];
};

export const thisOrThisSecond = (str) => {
  const re = new RegExp(/Дед, (.*) или (.*)\?/i);
  const words = str.match(re);

  return words[2];
};

export const yesYouAre = (str) => {
  const re = new RegExp(/Дед, (.*) ли (.*)\?/i);
  const words = str.match(re);

  if (words[2] === 'я') {
    words[2] = 'ты';
  }

  return `${words[2]} ${words[1]}`;
};

export const noYouAreNot = (str) => {
  const re = new RegExp(/Дед, (.*) ли (.*)\?/i);
  const words = str.match(re);

  if (words[2] === 'я') {
    words[2] = 'ты';
  }

  return `${words[2]} ни разу не ${words[1]}`;
};

export const youWantIt = (str) => {
  const re = new RegExp(/Дед, (.*) ли (.*)\?/i);
  const words = str.match(re);

  if (words[2][0] === 'я') {
    words[3] = 'ты';
    words[2] = words[2].replace(/я /, '');
  }

  if (words[1] === 'хочу') {
    words[1] = 'хочешь';
  }

  return `${words[3]} ${words[1]} ${words[2]}`;
};

export const noYouDontWantIt = (str) => {
  const re = new RegExp(/Дед, (.*) ли (.*)\?/i);
  const words = str.match(re);

  if (words[2][0] === 'я') {
    words[3] = 'ты';
    words[2] = words[2].replace(/я /, '');
  }

  if (words[1] === 'хочу') {
    words[1] = 'хочешь';
  }

  return `${words[3]} ни разу не ${words[1]} ${words[2]}`;
};

export const forecast = async (str) => {
  const re = new RegExp(/Дед, погода( в)? (.*)/i);
  const words = str.match(re);
  const tomorrow = DateTime.now().startOf('day').plus({day: 1}).toMillis() / 1000;
  const dayAfterTomorrow = DateTime.now().startOf('day').plus({day: 2}).toMillis() / 1000;
  const thirdDay = DateTime.now().startOf('day').plus({day: 3}).toMillis() / 1000;

  const city = words[2];
  const encodeCity = encodeURIComponent(city);

  const urlToday = `https://api.openweathermap.org/data/2.5/weather?q=${encodeCity}&appid=${weatherKey}`;
  const responseToday = await fetch(urlToday);
  const weatherObjToday = await responseToday.json();

  if (weatherObjToday.cod === '404' || weatherObjToday.cod === '404') {
    return 'Таких городов не знаем';
  }

  const mainTemp = weatherObjToday.main.temp;
  const temp = mainTemp - 273.15;

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeCity}&appid=94e3d6b0c8dec89a5b502795cf858064`;
  const response = await fetch(url);
  const forecastAllInfo = await response.json();

  const tomorrowForecast = forecastAllInfo.list.filter(el => el.dt >= tomorrow && el.dt < dayAfterTomorrow)
  const dayAfterTomorrowForecast = forecastAllInfo.list.filter(el => el.dt >= dayAfterTomorrow && el.dt < thirdDay)

  const tomorrowWeatherArrHigh = [];
  const tomorrowWeatherArrMin = [];

  const dayAfterTomorrowArrHigh = [];
  const dayAfterTomorrowArrMin = [];

  for (let i  = 0; i < tomorrowForecast.length; i++){
    tomorrowWeatherArrHigh.push(tomorrowForecast[i].main.temp_max)
    tomorrowWeatherArrMin.push(tomorrowForecast[i].main.temp_min)
  }

  for (let i = 0; i < dayAfterTomorrowForecast.length; i++){
    dayAfterTomorrowArrHigh.push(dayAfterTomorrowForecast[i].main.temp_max)
    dayAfterTomorrowArrMin.push(dayAfterTomorrowForecast[i].main.temp_min)
  }

  let tomorrowDayTemperature = Math.floor(Math.max(...tomorrowWeatherArrHigh) - 273.15);
  let tomorrowNightTemperature = Math.floor(Math.min(...tomorrowWeatherArrMin) - 273.15);

  let dayAfterTomorrowDayTemperature = Math.floor(Math.max(...dayAfterTomorrowArrHigh) - 273.15);
  let dayAfterTomorrowNightTemperature = Math.floor(Math.min(...dayAfterTomorrowArrMin) - 273.15);


  return `Прям щас там ${Math.floor(temp)}°C.
Завтра будет от ${tomorrowNightTemperature}°C до ${tomorrowDayTemperature}°C. 
А послезавтра будет от ${dayAfterTomorrowNightTemperature}°C до ${dayAfterTomorrowDayTemperature}°C.`;
};
