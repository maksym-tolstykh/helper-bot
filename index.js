import { Telegraf } from "telegraf";
import dotenv from 'dotenv'
import schedule from 'node-schedule';



/*My modules */
import { GetWeatherShedule, GetWeather } from "./modules/GetWeather.js";
import { GetEpicFreeGames, GetEpicFreeGamesShedule } from './modules/GetFreeGamesFromEpic.js';
import { userRating, getAllRatings, creatingRatingForMonth } from "./modules/UserRating.js";
import { schedules } from './modules/Schedules.js';




dotenv.config();
const bot = new Telegraf(process.env.BOT_TOKEN);

/*Hears */
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
/*Commands */
bot.command('rating', async (ctx) => ctx.reply(await getAllRatings(ctx)));
bot.command('weather', async (ctx) => ctx.reply(await GetWeather()));
bot.command('epic', async (ctx) => ctx.reply(await GetEpicFreeGames()));

bot.launch();

/*Every month rating */
schedules({ dayOfMonth: 1, hour: 15, minute: 52 }, creatingRatingForMonth, bot);

/*Weather */
schedules({ hour: 10, minute: 41 }, GetWeatherShedule, bot);

/*EpicGame */
schedules({ dayOfWeek: 4, hour: 18, minute: 30 }, GetEpicFreeGamesShedule, bot);

/*EpicGames 15-22 Dec */
schedules({ dayOfMonth: [15, 16, 17, 18, 19, 20, 21, 22], hour: 18, minute: 2 }, GetEpicFreeGamesShedule, bot);
