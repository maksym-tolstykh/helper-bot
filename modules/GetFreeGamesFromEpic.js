import axios from "axios";

/*Get EpicGames command */
export function GetEpicFreeGames() {
  return new Promise(async (resolve, reject) => {
    let text = "";
    const response = await axios.get(
      "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?country=UA"
    );
    if (response.data.data.Catalog.searchStore != null) {
      const gamesList = response.data.data.Catalog.searchStore.elements;
      text += "🆓Роздачі в EpicGames🆓\n";
      //Games
      for (let i = 0; i < gamesList.length; i++) {
        const currentDate = new Date();
        const startDate = new Date(
          gamesList[
            i
          ].promotions?.promotionalOffers[0]?.promotionalOffers[0].startDate
        );
        const endDate = new Date(
          gamesList[
            i
          ].promotions?.promotionalOffers[0]?.promotionalOffers[0].endDate
        );

        if (!isNaN(startDate) && !isNaN(endDate) && gamesList[i].price.totalPrice.fmtPrice.intermediatePrice == 0) {
          text += `🔥Назва: ⭐${gamesList[i].title} ⭐\n`;
          text += `🎮[Посилання на гру](https://store.epicgames.com/en-US/p/${gamesList[i].catalogNs.mappings[0].pageSlug})\n`;
          text += `📙Опис: \n${gamesList[i].description}\n`;
          text += `⚠️Дата початку роздачі: ${new Date(startDate).toLocaleString(
            "uk-UA"
          )}\n`;
          text += `⚠️Дата закінчення роздачі: ${new Date(
            endDate
          ).toLocaleString("uk-UA")}\n`;
          text += `\n`;
        }
      }
      resolve(text);
    } else {
      resolve("Сталася якась помилка!");
    }
  });
}

/*Get Epicgames shedule */
export async function GetEpicFreeGamesShedule(bot) {
  const chatId = process.env.CHAT_ID;
  let text = "";
  const response = await axios.get(
    "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?country=UA"
  );
  if (response.data.data.Catalog.searchStore != null) {
    const gamesList = response.data.data.Catalog.searchStore.elements;
    text += "🆓Роздачі в EpicGames🆓\n";
    //Games
    for (let i = 0; i < gamesList.length; i++) {
      const currentDate = new Date();
      const startDate = new Date(
        gamesList[
          i
        ].promotions?.promotionalOffers[0]?.promotionalOffers[0].startDate
      );
      const endDate = new Date(
        gamesList[
          i
        ].promotions?.promotionalOffers[0]?.promotionalOffers[0].endDate
      );

      if (!isNaN(startDate) && !isNaN(endDate)) {
        text += `🔥Назва: ⭐${gamesList[i].title}⭐\n`;
        text += `🎮[Посилання на гру](https://store.epicgames.com/en-US/p/${gamesList[i].catalogNs.mappings[0].pageSlug})\n`;
        text += `📙Опис: ${gamesList[i].description}\n`;
        text += `⚠️Дата початку роздачі: ${new Date(startDate).toLocaleString(
          "uk-UA"
        )}\n`;
        text += `⚠️Дата закінчення роздачі: ${new Date(endDate).toLocaleString(
          "uk-UA"
        )}\n`;
        text += `\n`;
      }
    }


    bot.telegram.sendMessage(chatId, text, { parse_mode: "Markdown" });
  } else {
    bot.telegram.sendMessage(chatId, "Сталася якась помилка!");
  }
}
//Додавання днів
//new Date(new Date(gamesList[i].effectiveDate).getTime() + (7 * 24 * 60 * 60 * 1000)).toLocaleString("uk-UA")
