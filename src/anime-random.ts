import fetch from 'node-fetch';

const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

export const animeRandomizer = async () => {
  const url = 'https://api.jikan.moe/v3/top/anime/';
  const page = Math.floor(getRandomArbitrary(1, 100));
  const result = [];
  const anime = Math.floor(getRandomArbitrary(1, 52));

  const response = await fetch(url + page.toString());
  const animeList = await response.json();
  result.push(animeList);

  const finalResult = result[0].top[anime];

  const animeResponse = await fetch(`https://api.jikan.moe/v3/anime/${finalResult.mal_id.toString()}`);
  const animeInfo = await animeResponse.json();

  return `*${finalResult.title}*
  
Эпизоды: ${finalResult.episodes}
Рейтинг: ${finalResult.score}
[‌‌‌](${finalResult.image_url})
Описание: 
${animeInfo.synopsis}`;
};
