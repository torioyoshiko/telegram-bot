/* eslint-disable import/first */
jest.mock('node-fetch');
import fetch from 'node-fetch';
import forecastInfo from './forecast.test.json';
import {
  yesYouWantTo,
  noYouDontWantTo,
  thisOrThisFirst,
  thisOrThisSecond,
  yesYouAre,
  noYouAreNot,
  youWantIt,
  noYouDontWantIt,
  forecast,
} from './functions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockedFetch = fetch as any;

describe('functions.ts', () => {
  describe('Дед, выпить ли мне чаю?', () => {
    test('YesYouWantTo -- Дед, выпить ли мне чаю? -> Тебе чаю выпить', () => {
      expect(yesYouWantTo('Дед, выпить ли мне чаю?')).toBe('Тебе чаю выпить');
    });

    test('NoYouDontWantTo -- Дед, выпить ли мне чаю? -> Тебе чаю не выпить', () => {
      expect(noYouDontWantTo('дед, выпить ли мне чаю?')).toBe('Тебе чаю не выпить');
    });
  });

  describe('This or that', () => {
    test('ThisOrThatFirst -- Дед, черное или белое? -> черное', () => {
      expect(thisOrThisFirst('Дед, черное или белое?')).toBe('черное');
    });

    test('ThisOrThatSecond -- Дед, черное или белое? -> белое', () => {
      expect(thisOrThisSecond('дед, черное или белое?')).toBe('белое');
    });
  });

  describe('He is?', () => {
    test('YesHeIs -- Дед, жаба ли я? -> ты жаба', () => {
      expect(yesYouAre('дед, жаба ли я?')).toBe('ты жаба');
    });

    test('NoHeisnt -- Дед, жаба ли я? -> ты ни разу не жаба', () => {
      expect(noYouAreNot('дед, жаба ли я?')).toBe('ты ни разу не жаба');
    });
  });

  describe('You want it?', () => {
    test('YouWantIt -- Дед, хочу ли я чаю? -> ты хочешь чаю', () => {
      expect(youWantIt('Дед, хочу ли я чаю?')).toBe('ты хочешь чаю');
    });

    test('NoYouDontWantIt -- Дед, хочу ли я чаю? -> ты ни разу не хочешь чаю', () => {
      expect(noYouDontWantIt('дед, хочу ли я чаю?')).toBe('ты ни разу не хочешь чаю');
    });
  });

  describe('Forecast', () => {
    test('Forecast Error 401 -- Дед, погода сглм -> Таких городов не знаем', async () => {
      mockedFetch.mockReturnValue(Promise.resolve({
        json() {
          return {
            cod: 401,
            message: 'Invalid API key. Please see http://openweathermap.org/faq#error401 for more info.',
          };
        },
      }));
      expect(await forecast('Дед, погода сглм')).toBe('Таких городов не знаем');
    });

    test('Forecast Error 404 -- Дед, погода сглм -> Таких городов не знаем', async () => {
      mockedFetch.mockReturnValue(Promise.resolve({
        json() {
          return {
            cod: '404',
            message: 'city not found',
          };
        },
      }));
      expect(await forecast('Дед, погода сглм')).toBe('Таких городов не знаем');
    });

    test('Forecast Resolve -- Дед, погода Минск -> Держи, мужик, погоду', async () => {
      jest.useFakeTimers('modern').setSystemTime(1620221673000);
      mockedFetch.mockReturnValueOnce(Promise.resolve({
        json() {
          return {
            coord: {
              lon: 27.5667,
              lat: 53.9,
            },
            weather: [
              {
                id: 800,
                main: 'Clear',
                description: 'clear sky',
                icon: '01d',
              },
            ],
            base: 'stations',
            main: {
              temp: 288.15,
              feels_like: 287.22,
              temp_min: 288.15,
              temp_max: 288.15,
              pressure: 1003,
              humidity: 58,
            },
            visibility: 10000,
            wind: {
              speed: 4,
              deg: 200,
            },
            clouds: {
              all: 0,
            },
            dt: 1620219813,
            sys: {
              type: 1,
              id: 8939,
              country: 'BY',
              sunrise: 1620181526,
              sunset: 1620236840,
            },
            timezone: 10800,
            id: 625144,
            name: 'Minsk',
            cod: 200,
          };
        },
      }));
      mockedFetch.mockReturnValueOnce(Promise.resolve({
        json() {
          return forecastInfo;
        },
      }));
      expect(await forecast('Дед, погода Минск')).toBe(
        'Прям щас там 15°C.\n'
          + 'Завтра ночью будет от 4°C, а днем до 9°C. \n'
          + 'Послезавтра ночью будет от 2°C, а днем до 10°C.',
      );
    });
  });
});
