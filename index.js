import { Telegraf } from "telegraf";
import dotenv from 'dotenv'
import schedule from 'node-schedule';


import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, child, get, update } from "firebase/database";
import axios from "axios";




const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: "telegram-rating-bot.firebaseapp.com",
    databaseURL: "https://telegram-rating-bot-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "telegram-rating-bot",
    storageBucket: "telegram-rating-bot.appspot.com",
    messagingSenderId: "226102728948",
    appId: "1:226102728948:web:d2e840a673d0027a3866a1",
    measurementId: "G-654H9FBFNX"
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(getDatabase());

dotenv.config()
const bot = new Telegraf(process.env.BOT_TOKEN);


bot.hears("👍", async ctx => {
    if (ctx.message.reply_to_message) {
        ctx.reply(await userRating(ctx, "збільшив", 1))
    }
})
bot.hears("👎", async ctx => {
    if (ctx.message.reply_to_message) {
        ctx.reply(await userRating(ctx, "зменшив", -2))
    }
})

bot.command('rating', async (ctx) => ctx.reply(await getAllRatings(ctx)));


bot.launch();


/*Функція яка віднімає, або додає рейтинг */
function userRating(ctx, str, num) {
    return new Promise((resolve, reject) => {
        const chatId = ctx.chat.id;

        const ownerMessage = ctx.message.from.id;
        const userFromUserName = ctx.message.from.username;
        const userToUserName = ctx.message.reply_to_message.from.username;
        const userToUserID = ctx.message.reply_to_message.from.id;

        if (ownerMessage === userToUserID && ctx.message.text === "👍") {
            resolve("Охуїв чи що? Накручувати собі рейтинг не можна🖕 👉👌");
        }

        get(child(dbRef, `chats/${chatId}/users/${userToUserID}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const currentRating = snapshot.val();
                const newRating = currentRating.rating + num;
                update(ref(database, 'chats/' + chatId + "/" + userToUserID), { rating: newRating });
                resolve(`Користувач @${userFromUserName} ${str} репутацію користувача @${userToUserName} на ${num}`);

            } else {
                const currentRating = 0;
                const newRating = currentRating - 2;
                set(ref(database, 'chats/' + chatId + "/users/" + userToUserID), {
                    rating: num < 0 ? newRating : 1,
                    userName: userToUserName
                });
                resolve(`Користувач @${userFromUserName} ${str} репутацію користувача @${userToUserName} на ${num}`);
            }
        }).catch((error) => {
            console.error(error);
        });


    })


}

/*Функція яка показує весь рейтинг */
function getAllRatings(ctx) {
    return new Promise((resolve, reject) => {
        const chatId = ctx.chat.id;

        get(child(dbRef, `chats/${chatId}/users`)).then((snapshot) => {
            if (snapshot.exists()) {
                const allUsers = snapshot.val();
                const userRatintArr = [];
                let text = "";
                /* Додаємо данні в масив для подальшого сортування */
                Object.keys(allUsers).forEach((item, index) => {
                    userRatintArr.push(allUsers[item]);
                })

                /*Сортування масиву з данними про рейтинг користувачів */
                const sortedArr = userRatintArr.sort((a, b) => { return b.rating - a.rating });
                sortedArr.forEach((item) => {
                    text += `@${item.userName} : ${item.rating}\n`;
                })
                resolve(text)
            } else {
                resolve("Рейтингу поки немає")
            }
        }).catch((error) => {
            console.error(error);
        });

    })


}



const scheduleRule = new schedule.RecurrenceRule();
scheduleRule.date = 1;
scheduleRule.hour = 1;
scheduleRule.minute = 1;

const job = schedule.scheduleJob(scheduleRule, function () {
    creatingRatingForMonth();
});

function creatingRatingForMonth() {
    console.log("start create month rating");
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthsUA = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];

    const date = new Date();

    const currMonthAndYear = months[date.getMonth() - 1] + date.getFullYear();
    const chatId = process.env.CHAT_ID;

    /*Беремо поточний рейтинг */
    get(child(dbRef, `chats/${chatId}/users`)).then((snapshot) => {
        if (snapshot.exists()) {
            const allUsers = snapshot.val();
            let userRatintArr = [];
            let ratingText = "";
            let telegramText = "";
            /* Додаємо данні в масив для подальшого сортування */
            Object.keys(allUsers).forEach((item, index) => {
                userRatintArr.push(allUsers[item]);
            })

            /*Сортування масиву з данними про рейтинг користувачів */
            const sortedArr = userRatintArr.sort((a, b) => { return b.rating - a.rating });

            sortedArr.forEach((item) => {
                ratingText += `@${item.userName} : ${item.rating}\n`;
            })

            set(ref(database, 'chats/' + chatId + "/" + 'monthRating/' + currMonthAndYear), { userRating: userRatintArr });

            telegramText += `***Рейтинг за ${monthsUA[date.getMonth() - 1]} місяць***\n`;
            telegramText += ratingText;

            bot.telegram.sendMessage(chatId, telegramText);


        }
    }).catch((error) => {
        console.error(error);
    });
    /* */


}

/*Weather */
const scheduleWeatherRule = new schedule.RecurrenceRule();

scheduleWeatherRule.hour = 9;
scheduleWeatherRule.minute = 30;


const weatherWorker = schedule.scheduleJob(scheduleWeatherRule, function () {
    GetWeather();
});

async function GetWeather() {
    const chatId = process.env.CHAT_ID;
    const response = await axios.get(process.env.API_WEATHER);
    const data = response.data;
    const currentDay = new Date(data.current.dt * 1000).toLocaleString();
    const currentWeatherDesc = data.current.weather[0].description;
    const currentTemp = data.current.temp;
    const currentFeelsLike = data.current.feels_like;
    const currentSunset = new Date(data.current.sunset * 1000).toLocaleTimeString();

    const text = `🌇Світанок у нашому місті🌇\t
\t
🌎Погода за ${currentDay}🌎 \t
⚡️На вулиці буде ${currentWeatherDesc}⚡️\t
🌡Температура: ${currentTemp}°C🌡\t
🌡По відчуттям як ${currentFeelsLike}°C🌡\t
☀️Захід сонця о ${currentSunset}☀️\t

🇺🇦Слава Україні🇺🇦`

    bot.telegram.sendMessage(chatId, text);
}




