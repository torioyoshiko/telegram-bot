import {
  yesYouWantTo,
  noYouDontWantTo,
  thisOrThisFirst,
  thisOrThisSecond,
  yesYouAre,
  noYouAreNot,
  youWantIt,
  noYouDontWantIt,
} from './functions';

describe('functions.js', () => {
  describe('Дед, выпить ли мне чаю?', () => {
    test('YesYouWantTo -- Дед, выпить ли мне чаю? -> Тебе чаю выпить', () => {
      expect(yesYouWantTo('Дед, выпить ли мне чаю?')).toBe('Тебе чаю выпить');
    });

    test('NoYouDontWantTo -- Дед, выпить ли мне чаю? -> Тебе чаю не выпить', () => {
      expect(noYouDontWantTo('Дед, выпить ли мне чаю?')).toBe('Тебе чаю не выпить');
    });
  });

  describe('This or that', () => {
    test('ThisOrThatFirst -- Дед, черное или белое? -> черное', () => {
      expect(thisOrThisFirst('Дед, черное или белое?')).toBe('черное');
    });

    test('ThisOrThatSecond -- Дед, черное или белое? -> белое', () => {
      expect(thisOrThisSecond('Дед, черное или белое?')).toBe('белое');
    });
  });

  describe('He is?', () => {
    test('YesHeIs -- Дед, жаба ли я? -> ты жаба', () => {
      expect(yesYouAre('Дед, жаба ли я?')).toBe('ты жаба');
    });

    test('NoHeisnt -- Дед, жаба ли я? -> ты ни разу не жаба', () => {
      expect(noYouAreNot('Дед, жаба ли я?')).toBe('ты ни разу не жаба');
    });
  });

  describe('You want it?', () => {
    test('YouWantIt -- Дед, хочу ли я чаю? -> ты хочешь чаю', () => {
      expect(youWantIt('Дед, хочу ли я чаю?')).toBe('ты хочешь чаю');
    });

    test('NoYouDontWantIt -- Дед, хочу ли я чаю? -> ты ни разу не хочешь чаю', () => {
      expect(noYouDontWantIt('Дед, хочу ли я чаю?')).toBe('ты ни разу не хочешь чаю');
    });
  });
});
