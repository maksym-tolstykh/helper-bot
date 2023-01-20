import { Scenes, Markup } from "telegraf";
import {
  getDringsData,
  saveDrinkData,
  searchDrinks,
} from "../database/dbConnection.js";

export const startScene = new Scenes.WizardScene(
  "BEER_SCENE_ID",
  (ctx) => {
    ctx.wizard.state.drinkData = {};
    ctx.reply("Категорія");
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.drinkData.category = ctx.message.text;
    ctx.reply("Назва напою");
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.drinkData.title = ctx.message.text;
    ctx.reply("Опишіть ваші враження");
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.drinkData.desc = ctx.message.text;
    ctx.reply("Рейтинг від 1/10");
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (parseInt(ctx.message.text) > 10) {
      ctx.reply("Рейтинг більше 10, введіть число в межах 10.");
      return;
    }

    ctx.wizard.state.drinkData.rating = ctx.message.text;
    ctx.reply("Дякую за відгук!");
    saveDrinkData(ctx.wizard.state.drinkData);
    return ctx.scene.leave();
  }
);

//Get Drinks List
export async function getDrinksList(ctx, bot) {
  const callbackData = ctx.callbackQuery.data;

  const page = +callbackData.split(" ")[1];
  let disabled = {
    next: false,
    prev: false,
  };

  if (page === 0) disabled.prev = true;
  if ((await getDringsData(page + 1)) === "") disabled.next = true;

  bot.telegram.editMessageText(
    ctx.chat.id,
    ctx.callbackQuery.message.message_id,
    null,
    await getDringsData(page),
    Markup.inlineKeyboard([
      Markup.button.callback("prev", `prev_all ${page - 1}`, disabled.prev),
      Markup.button.callback("next", `next_all ${page + 1}`, disabled.next),
    ])
  );
}

export async function getDrinksListForParam(ctx, bot) {
  const callbackData = ctx.callbackQuery.data;

  const page = +callbackData.split(" ")[1];
  const searchParam = callbackData.split(" ")[2];
  let disabled = {
    next: false,
    prev: false,
  };

  if (page === 0) disabled.prev = true;
  if ((await searchDrinks(searchParam, page + 1)) === "") disabled.next = true;
  console.log(page, searchParam);
  bot.telegram.editMessageText(
    ctx.chat.id,
    ctx.callbackQuery.message.message_id,
    null,
    await searchDrinks(searchParam, page),
    Markup.inlineKeyboard([
      Markup.button.callback(
        "prev",
        `prev_search ${page - 1} ${searchParam}`,
        disabled.prev
      ),
      Markup.button.callback(
        "next",
        `next_search ${page + 1} ${searchParam}`,
        disabled.next
      ),
    ])
  );
}
