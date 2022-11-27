import { User } from 'typegram';
import {
  attribute,
  hashKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import DynamoDB = require('aws-sdk/clients/dynamodb');
import { shuffle } from 'lodash';
import { DateTime } from 'luxon';

const mapper = new DataMapper({
  client: new DynamoDB(),
});

@table(`${process.env.STAGE}-shippering-users`)
class ChatShipUsers {
  @hashKey()
  chatId: string;

  @attribute()
  users: Array<User> = [];

  @attribute()
  shipOfTheDay: string;

  @attribute()
  generatedDate: string;
}

export const addUserShip = async (userInfo: User, chatId: string) => {
  let existingChat: ChatShipUsers;

  try {
    existingChat = await mapper.get(Object.assign(new ChatShipUsers(), { chatId }));
  } catch (e) {
    console.log(e);
    existingChat = new ChatShipUsers();
    existingChat.chatId = chatId;
  }
  if (!existingChat.users.find((user) => user.id.toString() === userInfo.id.toString())) {
    existingChat.users.push(userInfo);
    await mapper.put(existingChat);

    return true;
  }

  return false;
};

export const createShip = async (chatId: string) => {
  try {
    const existingChat = await mapper.get(Object.assign(new ChatShipUsers(), { chatId }));
    const shuffledUsers = shuffle(existingChat.users);

    if (shuffledUsers.length < 2) {
      return 'Трэба каб дадалося хаця б два чалавекі';
    }

    if (existingChat.generatedDate !== DateTime.now().toFormat('dd-MM-yyyy')) {
      existingChat.generatedDate = DateTime.now().toFormat('dd-MM-yyyy');
      existingChat.shipOfTheDay = `[${shuffledUsers[0].first_name}](tg://user?id=${shuffledUsers[0].id}) + [${shuffledUsers[1].first_name}](tg://user?id=${shuffledUsers[1].id}) = ❤`;
      await mapper.put(existingChat);
      return existingChat.shipOfTheDay;
    }

    return `Пара дня ўжо была абрана! 
${existingChat.shipOfTheDay}`;
  } catch (e) {
    console.log(e);
    return 'Яшчэ ніхто не дадаўся...';
  }
};
