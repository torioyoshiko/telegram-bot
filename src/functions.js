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
