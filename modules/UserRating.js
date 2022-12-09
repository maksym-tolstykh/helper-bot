import dotenv from 'dotenv'

import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, child, get, update } from "firebase/database";

dotenv.config();

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

/*Функція яка віднімає, або додає рейтинг */
export function userRating(ctx, str, num) {
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
                update(ref(database, 'chats/' + chatId + "/users/" + userToUserID), { rating: newRating });
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
export function getAllRatings(ctx) {
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


export function creatingRatingForMonth(bot) {
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