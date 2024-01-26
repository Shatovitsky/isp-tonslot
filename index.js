const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const config = require('./config');
const mongoose = require('mongoose');

const bot = new TelegramBot(config.token, { polling: true });
const app = express();

const mongoDBURL = 'mongodb+srv://casinohack:41155qweasdzxc@cluster0.afkand9.mongodb.net/bots-clients';
mongoose.connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Подключено к MongoDB Atlas'))
    .catch((err) => console.error('Ошибка при подключении к MongoDB Atlas:', err));


    const userSchema = new mongoose.Schema({
      chatId: {
          type: Number,
          unique: true
      },
      username: String,
      firstName: String,
      lastName: String,
      languageCode: String,
      isBot: Boolean
  });

  const User = mongoose.model('User', userSchema, 'bot-isp');

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
    const userId = msg.from.id;
    const username = msg.from.username;
    const firstName = msg.from.first_name;
    const lastName = msg.from.last_name;
    const languageCode = msg.from.language_code;
    const isBot = msg.from.is_bot;
    const text = msg.text;
    let existingUser;  

    try {
        existingUser = await User.findOne({ chatId: chatId });
    } catch (error) {
        console.error('Ошибка при выполнении запроса к базе данных:', error);
    }

    if (!existingUser) {
        const newUser = new User({
            chatId: chatId,
            username: username,
            firstName: firstName,
            lastName: lastName,
            languageCode: languageCode,
            isBot: isBot
        });
        await newUser.save();
        
    } else {
       
    }
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