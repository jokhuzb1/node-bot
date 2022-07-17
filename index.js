import TelegramAPI from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { againOptions, gameOptions } from './options.js';

dotenv.config();


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const TOKEN = process.env.BOT_API;
const bot = new TelegramAPI(TOKEN, { polling: true });
const chats = {}


const startGame = async (chatId) => {
  await bot.sendMessage(chatId, "Mmmm..., Im thinking about random number from 0 to 9, you have to guess it right!!!");
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  return setTimeout(() => {
    bot.sendMessage(chatId, "Gotcha, Guess now...", gameOptions);
  }, 1000);
}
bot.setMyCommands([
  { command: '/start', description: 'Start bot' },
  { command: '/info', description: 'Information about this bot' },
  { command: '/game', description: 'Number guessing game' },
])

bot.on('message', async msg => {
  const txt = msg.text;
  const chatId = msg.chat.id;

  if (txt === '/start') {
    return bot.sendMessage(chatId, "Welcome, this bot helps you get info about the specific place which you are lookig for, \n or all the place's you want to see. \n Make sure to choose the right city, and bot will list its location, phone number and opening hours for you ")
  }

  if (txt === '/info') {
    return bot.sendMessage(chatId, "This bot can help you to find nearest establishments, such as: local caffe's, restaurants, chemists and so on.. \n You can search by name or list all of them at once listed by 10 items at a time ")
  }

  if (txt === '/game') {
    return startGame(chatId)
  }
  return bot.sendMessage(chatId, "I do not understant what you have said");
});

bot.on('callback_query', async msg => {
  const data = msg.data;
  const chatId = msg.message.chat.id;
  const msgId = msg.message.message_id
  if (data === '/again') {
    for (let i = 1; i < 3; i++) {
      bot.deleteMessage(chatId, msgId - i)
    }
    return startGame(chatId)
  }
  if (parseInt(data) === parseInt(chats[chatId])) {
    return bot.sendMessage(chatId, `Congratulation, you guessed right number: ${data}`, againOptions)
  } else {
    return bot.sendMessage(chatId, `Oops, you guessed wrong number number: ${data}`, againOptions)
  }
})

