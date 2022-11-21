import { Telegraf } from "telegraf";
import dotenv from 'dotenv'


import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, child, get, update } from "firebase/database";




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
        ctx.reply(await userRating(ctx, "зменшив", 2))
    }
})

bot.command('rating', async (ctx) => ctx.reply(await getAllRatings(ctx)));


bot.launch();


/*Функція яка віднімає, або додає рейтинг */
function userRating(ctx, str, num) {
    return new Promise((resolve, reject) => {
        const chatId = ctx.chat.id;


        const userFromUserName = ctx.message.from.username;
        const userToUserName = ctx.message.reply_to_message.from.username;
        const userToUserID = ctx.message.reply_to_message.from.id;


        get(child(dbRef, `chats/${chatId}/${userToUserID}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const currentRating = snapshot.val();
                const newRating = currentRating.rating + num;
                update(ref(database, 'chats/' + chatId + "/" + userToUserID), { rating: newRating });
                resolve(`Користувач @${userFromUserName} ${str} репутацію користувача @${userToUserName} на ${num}`);

            } else {
                const currentRating = 0;
                const newRating = currentRating - 2;
                set(ref(database, 'chats/' + chatId + "/" + userToUserID), {
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

        get(child(dbRef, `chats/${chatId}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const allUsers = snapshot.val();
                let text = "";
                Object.keys(allUsers).forEach((item, index) => {
                    text += `@${allUsers[item].userName} : ${allUsers[item].rating}\n`

                })

                resolve(text)


            } else {
                resolve("Рейтингу поки немає")
                //console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

    })


}