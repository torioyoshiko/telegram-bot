import fetch from 'node-fetch';
import { DateTime } from 'luxon';

const weatherKey = process.env.WEATHER_KEY;
const translateKey = process.env.TRANSLATE_KEY;

export const noYouDontWantTo = (str: string) => {
  const re = new RegExp(/Д[еіi]д,(.*) ли мне (.*)\?/i);
  const words = str.match(re);

  if (words[2] === 'я') {
    words[2] = 'ты';
  }

  return `Тебе ${words[2]} не${words[1]}`;
};

export const yesYouWantTo = (str: string) => {
  const re = new RegExp(/Д[еіi]д,(.*) ли мне (.*)\?/i);
  const words = str.match(re);

  if (words[2] === 'я') {
    words[2] = 'ты';
  }

  return `Тебе ${words[2]}${words[1]}`;
};

export const thisOrThisFirst = (str: string) => {
  const re = new RegExp(/Д[еіi]д, (.*) (или|чи) (.*)\?/i);
  const words = str.match(re);

  return words[1];
};

export const thisOrThisSecond = (str: string) => {
  const re = new RegExp(/Д[еіi]д, (.*) (или|чи) (.*)\?/i);
  const words = str.match(re);

  return words[3];
};

export const yesYouAre = (str: string) => {
  const re = new RegExp(/Д[еіi]д, (.*) ли (.*)\?/i);
  const words = str.match(re);

  if (words[2] === 'я') {
    words[2] = 'ты';
  }

  return `${words[2]} ${words[1]}`;
};

export const noYouAreNot = (str: string) => {
  const re = new RegExp(/Д[еіi]д, (.*) ли (.*)\?/i);
  const words = str.match(re);

  if (words[2] === 'я') {
    words[2] = 'ты';
  }

  return `${words[2]} ни разу не ${words[1]}`;
};

export const youWantIt = (str: string) => {
  const re = new RegExp(/Д[еіi]д, (.*) ли (.*)\?/i);
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

export const noYouDontWantIt = (str: string) => {
  const re = new RegExp(/Д[еіi]д, (.*) ли (.*)\?/i);
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

export const forecast = async (str: string) => {
  const re = new RegExp(/Д[еіi]д, погода( в)? (.*)/i);
  const words = str.match(re);
  const tomorrow = DateTime.now().startOf('day').plus({ day: 1 }).toMillis() / 1000;
  const dayAfterTomorrow = DateTime.now().startOf('day').plus({ day: 2 }).toMillis() / 1000;
  const thirdDay = DateTime.now().startOf('day').plus({ day: 3 }).toMillis() / 1000;

  const city = words[2];
  const translate = `https://translation.googleapis.com/language/translate/v2?key=${translateKey}&target=en&q=${city}`;
  const responseTranslate = await fetch(translate);
  const translateResponseJson = await responseTranslate.json();
  const translatedCity = translateResponseJson?.data?.translations?.[0]?.translatedText;

  if (!translatedCity) {
    return 'Таких городов не знаем';
  }
  const encodeCity = encodeURIComponent(translatedCity);

  const urlToday = `https://api.openweathermap.org/data/2.5/weather?q=${encodeCity}&appid=${weatherKey}`;
  const responseToday = await fetch(urlToday);
  const weatherObjToday = await responseToday.json();

  if (weatherObjToday.cod === '404' || weatherObjToday.cod === 401) {
    return 'Таких городов не знаем';
  }

  const mainTemp = weatherObjToday.main.temp;
  const temp = mainTemp - 273.15;

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeCity}&appid=${weatherKey}`;
  const response = await fetch(url);
  const forecastAllInfo = await response.json();

  const tomorrowForecast = forecastAllInfo.list
    .filter((el) => el.dt >= tomorrow && el.dt < dayAfterTomorrow);
  const dayAfterTomorrowForecast = forecastAllInfo.list
    .filter((el) => el.dt >= dayAfterTomorrow && el.dt < thirdDay);

  const tomorrowWeatherArrHigh = [];
  const tomorrowWeatherArrMin = [];

  const dayAfterTomorrowArrHigh = [];
  const dayAfterTomorrowArrMin = [];

  for (let i = 0; i < tomorrowForecast.length; i++) {
    tomorrowWeatherArrHigh.push(tomorrowForecast[i].main.temp_max);
    tomorrowWeatherArrMin.push(tomorrowForecast[i].main.temp_min);
  }

  for (let i = 0; i < dayAfterTomorrowForecast.length; i++) {
    dayAfterTomorrowArrHigh.push(dayAfterTomorrowForecast[i].main.temp_max);
    dayAfterTomorrowArrMin.push(dayAfterTomorrowForecast[i].main.temp_min);
  }

  const tomorrowDayTemperature = Math.floor(Math.max(...tomorrowWeatherArrHigh) - 273.15);
  const tomorrowNightTemperature = Math.floor(Math.min(...tomorrowWeatherArrMin) - 273.15);

  const dayAfterTomorrowDayTemperature = Math.floor(Math.max(...dayAfterTomorrowArrHigh) - 273.15);
  const dayAfterTomorrowNightTemperature = Math.floor(Math.min(...dayAfterTomorrowArrMin) - 273.15);

  if (translateResponseJson?.data?.translations?.[0]?.detectedSourceLanguage === 'uk') {
    return `На разі там ${Math.floor(temp)}°C.
Завтра вночі буде від ${tomorrowNightTemperature}°C, а вдень до ${tomorrowDayTemperature}°C. 
Післязавтра вночі буде від ${dayAfterTomorrowNightTemperature}°C, а вдень до ${dayAfterTomorrowDayTemperature}°C.`;
  }

  return `Прям щас там ${Math.floor(temp)}°C.
Завтра ночью будет от ${tomorrowNightTemperature}°C, а днем до ${tomorrowDayTemperature}°C. 
Послезавтра ночью будет от ${dayAfterTomorrowNightTemperature}°C, а днем до ${dayAfterTomorrowDayTemperature}°C.`;
};

export const jokes = async () => {
  const response = await fetch('https://backend-omega-seven.vercel.app/api/getjoke');
  const jokeArr = await response.json();
  const { question, punchline } = jokeArr[0];

  return `${question}
  .
  .
  .
${punchline}`;
};

export const roll = (str: string) => {
  const min = Number(str.split(' ')[2]);
  const max = Number(str.split(' ')[4]);

  return Math.floor(Math.random() * (max - min) + min);
};
