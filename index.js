const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const config = require('./config');

const bot = new TelegramBot(config.token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data === 'button1') {
        await bot.sendPhoto(chatId, config.file_id, {
            caption:"Aviator predicciones de resultados de juegos ✈️ hasta 50x 🔥",
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Obtener una previsión', web_app: {url: config.webAppUrl}}]
                ]
            }
        });



    } else if (data === 'button2') {
        await bot.sendPhoto(chatId, config.file_id2, {
            caption:"LuckyJet predicciones de resultados de juegos ✈️ hasta 50x 🔥",
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Obtener una previsión', web_app: {url: config.webAppUrl2}}]
                ]
            }
        });
    }
  });

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "/start") {
      const text = 'Hola, selecciona el modo de juego deseado';
      const options = {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [
              { text: 'Aviator', callback_data: 'button1' },
              { text: 'LuckyJet', callback_data: 'button2' },
            ],
          ],
        }),
      };

      await bot.sendMessage(chatId, text, options);
    }
  });