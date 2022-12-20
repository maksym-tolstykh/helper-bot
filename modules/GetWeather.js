import axios from "axios";

/*Function for shedule */
export async function GetWeatherShedule(bot) {
    const chatId = process.env.CHAT_ID;
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=50.7723&lon=29.2383&exclude=minutely,hourly&appid=${process.env.API_WEATHER}&units=metric&lang=ua`);
    const data = response.data;
    const currentDay = new Date(data.current.dt * 1000).toLocaleString("uk-UA");
    const currentWeatherDesc = data.current.weather[0].description;
    const currentTemp = data.current.temp;
    const currentFeelsLike = data.current.feels_like;
    const currentSunset = new Date(data.current.sunset * 1000).toLocaleTimeString("uk-UA");

    const text = `🌇Погода у нашому місті🌇

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
export function GetWeatherWeek() {
    return new Promise(async (resolve, reject) => {
        const days = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П`ятниця', 'Субота'];
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=50.7723&lon=29.2383&exclude=minutely,hourly&appid=${process.env.API_WEATHER}&units=metric&lang=ua`);
        const data = response.data.daily;

        let text = "";
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            const day = days[new Date(data[i].dt * 1000).getDay()];
            const dayNum = new Date(data[i].dt * 1000).getDate();
            const temp = [data[i].temp.day, data[i].temp.night]
            const weatherDesc = data[i].weather[0].description;
            const sunrise = new Date(data[i].sunrise * 1000).toLocaleTimeString("uk-UA");
            const sunset = new Date(data[i].sunset * 1000).toLocaleTimeString("uk-UA");
            const windSpeed = data[i].wind_speed;
            text += `📌${day} / ${dayNum}\n Погода: ${weatherDesc} \n🌡Температура:\n 🌇День: ${temp[0]}°C | 🌃Ніч: ${temp[1]}°C\n💨nightВітер: ${windSpeed}\n🌅Світанок: ${sunrise}\n🌄Захід сонця: ${sunset}\n\n`
        }
        resolve(text || "");
    })

}