import { Telegraf, Scenes, Markup, session } from "telegraf";

import dotenv from "dotenv";

/*My modules */
import {
  GetWeatherShedule,
  GetWeather,
  GetWeatherWeek,
} from "./modules/GetWeather.js";
import {
  GetEpicFreeGames,
  GetEpicFreeGamesShedule,
} from "./modules/GetFreeGamesFromEpic.js";
import {
  userRating,
  getAllRatings,
  creatingRatingForMonth,
} from "./modules/UserRating.js";
import { schedules } from "./modules/Schedules.js";
import {
  getDrinksList,
  getDrinksListForParam,
  startScene,
} from "./modules/DrinkRating.js";
import { getDringsData, searchDrinks } from "./database/dbConnection.js";

dotenv.config();
const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Scenes.Stage([startScene]);
bot.use(session());
bot.use(stage.middleware());

/*Hears */
// bot.hears("👍", async (ctx) => {
//   if (ctx.message.reply_to_message) {
//     ctx.reply(await userRating(ctx, "збільшив", 1));
//   }
// });
// bot.hears("👎", async (ctx) => {
//   if (ctx.message.reply_to_message) {
//     ctx.reply(await userRating(ctx, "зменшив", -2));
//   }
// });

// /*Commands */
// bot.command("rating", async (ctx) => ctx.reply(await getAllRatings(ctx)));
bot.command("weather", async (ctx) => ctx.reply(await GetWeather()));
bot.command("weatherweek", async (ctx) => ctx.reply(await GetWeatherWeek()));
bot.command("epic", async (ctx) =>
  ctx.reply(await GetEpicFreeGames(), {
    parse_mode: "Markdown",
  })
);
bot.command("be", async (ctx) => await ctx.scene.enter("BEER_SCENE_ID"));
bot.command("t", async (ctx) => {
  ctx.reply(
    await getDringsData(0),
    Markup.inlineKeyboard([Markup.button.callback("next", "next_all 1")])
  );
});
bot.command("s", async (ctx) => {
  const searchText = ctx.message.text.replace("/s", "").trim();
  ctx.reply(
    await searchDrinks(searchText, 0),
    Markup.inlineKeyboard([
      Markup.button.callback(
        "next",
        `next_search 1 ${searchText}`,
        (await searchDrinks(searchText, 1)) === "" ? true : false
      ),
    ])
  );
});

/*Events */
bot.on("callback_query", (ctx) => {
  const callbackData = ctx.callbackQuery.data;
  //console.log(callbackData);
  if (
    callbackData.startsWith("next_all") ||
    callbackData.startsWith("prev_all")
  )
    getDrinksList(ctx, bot);

  if (
    callbackData.startsWith("next_search") ||
    callbackData.startsWith("prev_search")
  )
    getDrinksListForParam(ctx, bot);
});

bot.launch();
/*Every month rating */
schedules({ dayOfMonth: 1, hour: 15, minute: 52 }, creatingRatingForMonth, bot);

/*Weather */
schedules({ hour: 10, minute: 41 }, GetWeatherShedule, bot);
schedules({ hour: 21, minute: 1 }, GetWeatherShedule, bot);

/*EpicGame */
schedules({ dayOfWeek: 4, hour: 18, minute: 30 }, GetEpicFreeGamesShedule, bot);
//schedules({ hour: 18, minute: 2 }, GetEpicFreeGamesShedule, bot);
