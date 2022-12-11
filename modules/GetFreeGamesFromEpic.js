import axios from "axios";

/*Get EpicGames command */
export function GetEpicFreeGames() {
    return new Promise(async (resolve, reject) => {
        let text = "";
        const response = await axios.get("https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?country=UA");
        if (response.status === 200) {
            const gamesList = response.data.data.Catalog.searchStore.elements;
            //console.log(gamesList);
            for (let i = 0; i < gamesList.length; i++) {
                if (new Date(gamesList[i].effectiveDate).getFullYear() === new Date().getFullYear()) {
                    if (new Date(gamesList[i].effectiveDate).getMonth() === new Date().getMonth()) {
                        text += "🆓Роздачі в EpicGames🆓\n"
                        text += `Назва: ${gamesList[i].title}\n`;
                        text += `Дата закінчення роздачі: ${new Date(gamesList[i].effectiveDate).toLocaleString("uk-UA")}\n`;
                        text += `\n`
                    }
                }
            }
            resolve(text)
        }
        else {
            resolve("Сталася якась помилка!")
        }

    })
}

/*Get Epicgames shedule */
export async function GetEpicFreeGamesShedule(bot) {
    const chatId = process.env.CHAT_ID;
    let text = "";
    const response = await axios.get("https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?country=UA");
    if (response.status === 200) {
        const gamesList = response.data.data.Catalog.searchStore.elements;
        //console.log(gamesList);
        for (let i = 0; i < gamesList.length; i++) {
            if (new Date(gamesList[i].effectiveDate).getFullYear() === new Date().getFullYear()) {
                if (new Date(gamesList[i].effectiveDate).getMonth() === new Date().getMonth()) {
                    text += "🆓Роздачі в EpicGames🆓\n"
                    text += `Назва: ${gamesList[i].title}\n`;
                    text += `Дата закінчення роздачі: ${new Date(gamesList[i].effectiveDate).toLocaleString("uk-UA")}\n`;
                    text += `\n`
                }
            }
        }
        bot.telegram.sendMessage(chatId, text);
    }
    else {
        resolve("Сталася якась помилка!")
    }


}