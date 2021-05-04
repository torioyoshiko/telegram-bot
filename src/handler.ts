import { Telegraf } from 'telegraf';
import { APIGatewayProxyEvent } from 'aws-lambda';
import {
  yesYouWantTo,
  noYouDontWantTo,
  thisOrThisFirst,
  thisOrThisSecond,
  yesYouAre,
  noYouAreNot,
  youWantIt,
  noYouDontWantIt, forecast,
} from './functions';

const telegramToken = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(telegramToken);

const randomInteger = (min, max) => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

bot.start((ctx) => ctx.reply(`Привет, ${ctx.from.first_name}`));
bot.hears('Дед', (ctx) => ctx.reply('Че те надо', { reply_to_message_id: ctx.message.message_id }));
bot.hears('дед конфа', (ctx) => ctx.reply(Buffer.from('0L/QvtGI0LXQuyDQvdCw0YXRg9C5', 'base64').toString('utf-8'), { reply_to_message_id: ctx.message.message_id }));
bot.hears(/на заре/i, (ctx) => ctx.replyWithVoice({ source: 'na-zare.ogg' }, { reply_to_message_id: ctx.message.message_id }));
bot.hears(/Дед, погода (.*)/, async (ctx) => ctx.reply(await forecast(ctx.message.text), { reply_to_message_id: ctx.message.message_id }));

bot.hears('/help', (ctx) => ctx.reply(
  '1. Дед.\n'
    + '\n2. на заре.\n'
    + '\n3. Дед, погода *город*.\n Например: Дед, погода стокгольм \n'
    + '\n4. Дед, *глагол* ли мне *что-то?\n Например: Дед, выпить ли мне чаю?\n'
    + '\n5. Дед, *что-то* или *что-то*?\n Например: Дед, черное или белое?\n'
    + '\n6. Дед, *что-то* ли *что-то*?\n Например: Дед, желтое ли такси?\n',
  { reply_to_message_id: ctx.message.message_id },
));

bot.hears(/Дед,(.*) ли мне (.*)\?/i, (ctx) => {
  if (randomInteger(1, 10) > 5) {
    ctx.reply(noYouDontWantTo(ctx.message.text), { reply_to_message_id: ctx.message.message_id });
  } else {
    ctx.reply(yesYouWantTo(ctx.message.text), { reply_to_message_id: ctx.message.message_id });
  }
});

bot.hears(/Дед, (.*) или (.*)\?/i, (ctx) => {
  if (randomInteger(1, 10) > 5) {
    ctx.reply(thisOrThisFirst(ctx.message.text), { reply_to_message_id: ctx.message.message_id });
  } else {
    ctx.reply(thisOrThisSecond(ctx.message.text), { reply_to_message_id: ctx.message.message_id });
  }
});

bot.hears(/Дед, (.*) ли (.*)\?/i, (ctx) => {
  if (ctx.message.text.indexOf('хочу') === -1) {
    if (randomInteger(1, 10) > 5) {
      ctx.reply(noYouAreNot(ctx.message.text), { reply_to_message_id: ctx.message.message_id });
      return;
    }
    ctx.reply(yesYouAre(ctx.message.text), { reply_to_message_id: ctx.message.message_id });
    return;
  }

  if (randomInteger(1, 10) > 5) {
    ctx.reply(noYouDontWantIt(ctx.message.text), { reply_to_message_id: ctx.message.message_id });
  } else {
    ctx.reply(youWantIt(ctx.message.text), { reply_to_message_id: ctx.message.message_id });
  }
});

export const handleMessage = async (event: APIGatewayProxyEvent) => {
  try {
    const body = event.body ? JSON.parse(event.body) : event;
    await bot.handleUpdate(body);
    return { body: JSON.stringify({ body }), statusCode: 200 };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return {
      body: JSON.stringify({ message: 'Something went wrong' }),
      statusCode: 200,
    };
  }
};
