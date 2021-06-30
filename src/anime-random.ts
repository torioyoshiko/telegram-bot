import fetch from 'node-fetch';

const getRandomArbitrary = (min, max) => Math.floor(Math.random() * (max - min) + min);

export const animeRandomizer = async () => {
  const page = getRandomArbitrary(1, 100);
  const anime = getRandomArbitrary(1, 52);

  const response = await fetch(`https://api.jikan.moe/v3/top/anime/${page.toString()}`);
  const animeList = await response.json();

  const finalResult = animeList.top[anime];

  const animeResponse = await fetch(`https://api.jikan.moe/v3/anime/${finalResult.mal_id.toString()}`);
  const animeInfo = await animeResponse.json();

  return `*${finalResult.title}*
  
Эпизоды: ${finalResult.episodes}
Рейтинг: ${finalResult.score}
[‌‌‌](${finalResult.image_url})
Описание: 
${animeInfo.synopsis}`;
};
