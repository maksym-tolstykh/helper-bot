import { Telegraf } from "telegraf";
import dotenv from 'dotenv'
import schedule from 'node-schedule';



/*My modules */
import { GetWeatherShedule, GetWeather } from "./modules/GetWeather.js";
import { GetEpicFreeGames, GetEpicFreeGamesShedule } from './modules/GetFreeGamesFromEpic.js';
import { userRating, getAllRatings, creatingRatingForMonth } from "./modules/UserRating.js";



dotenv.config();
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
bot.command('weather', async (ctx) => ctx.reply(await GetWeather()));
bot.command('epic', async (ctx) => ctx.reply(await GetEpicFreeGames()));

bot.launch();

const scheduleRule = new schedule.RecurrenceRule();
scheduleRule.date = 1;
scheduleRule.hour = 1;
scheduleRule.minute = 1;

const job = schedule.scheduleJob(scheduleRule, function () {
    creatingRatingForMonth(bot);
});


/*Weather */
const scheduleWeatherRule = new schedule.RecurrenceRule();

scheduleWeatherRule.hour = 10;
scheduleWeatherRule.minute = 41;


const weatherWorker = schedule.scheduleJob(scheduleWeatherRule, function () {
    GetWeatherShedule(bot);
});

/*EpicGame */
const scheduleEpicRule = new schedule.RecurrenceRule();

scheduleWeatherRule.dayOfWeek = 4;
scheduleWeatherRule.hour = 18;
scheduleWeatherRule.minute = 30;

const scheduleEpicWorker = schedule.scheduleJob(scheduleWeatherRule, function () {
    GetEpicFreeGamesShedule(bot);
});

/*EpicGames 15-22 Dec */

const scheduleEpicFreeWeekRule = new schedule.RecurrenceRule();

scheduleWeatherRule.dayOfMonth = new schedule.Range(15, 22); //change every year
scheduleWeatherRule.hour = 18;
scheduleWeatherRule.minute = 2;

const scheduleEpicFreeWeekWorker = schedule.scheduleJob(scheduleEpicFreeWeekRule, function () {
    GetEpicFreeGamesShedule(bot);
});






