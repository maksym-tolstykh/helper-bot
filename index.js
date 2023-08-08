import { Telegraf } from "telegraf";

import dotenv from "dotenv";

/*My modules */

import {
  GetEpicFreeGames,
  GetEpicFreeGamesShedule,
} from "./modules/GetFreeGamesFromEpic.js";
import { schedules } from "./modules/Schedules.js";

dotenv.config();
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.command("epic", async (ctx) =>
  ctx.reply(await GetEpicFreeGames(), {
    parse_mode: "Markdown",
  })
);

bot.launch();
/*EpicGame */
schedules({ dayOfWeek: 4, hour: 18, minute: 1 }, GetEpicFreeGamesShedule, bot);



