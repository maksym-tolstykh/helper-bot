import axios from "axios";

/*Function for shedule */
export async function GetWeatherShedule() {
    const chatId = ctx.chat.id;
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=50.7723&lon=29.2383&exclude=minutely,hourly&appid=${process.env.API_WEATHER}&units=metric&lang=ua`);
    const data = response.data;
    const currentDay = new Date(data.current.dt * 1000).toLocaleString();
    const currentWeatherDesc = data.current.weather[0].description;
    const currentTemp = data.current.temp;
    const currentFeelsLike = data.current.feels_like;
    const currentSunset = new Date(data.current.sunset * 1000).toLocaleTimeString();

    const text = `🌇Світанок у нашому місті🌇
\t
🌎Погода за ${currentDay}🌎 
⚡️На вулиці буде ${currentWeatherDesc}⚡️
🌡Температура: ${currentTemp}°C🌡
🌡По відчуттям як ${currentFeelsLike}°C🌡
☀️Захід сонця о ${currentSunset}☀️

🇺🇦Слава Україні🇺🇦`

    bot.telegram.sendMessage(chatId, text);
}

/*Function for command */
export function GetWeather() {
    return new Promise(async (resolve, reject) => {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=50.7723&lon=29.2383&exclude=minutely,hourly&appid=${process.env.API_WEATHER}&units=metric&lang=ua`);
        const data = response.data;
        const currentDay = new Date(data.current.dt * 1000).toLocaleString("uk-UA");
        const currentWeatherDesc = data.current.weather[0].description;
        const currentTemp = data.current.temp;
        const currentFeelsLike = data.current.feels_like;
        const currentSunset = new Date(data.current.sunset * 1000).toLocaleTimeString("uk-UA");

        const text = `🌇Погода у нашому місті🌇
\t
🌎Погода за ${currentDay}🌎 
⚡️На вулиці буде ${currentWeatherDesc}⚡️
🌡Температура: ${currentTemp}°C🌡
🌡По відчуттям як ${currentFeelsLike}°C🌡
☀️Захід сонця о ${currentSunset}☀️

🇺🇦Слава Україні🇺🇦`

        resolve(text);
    })
}