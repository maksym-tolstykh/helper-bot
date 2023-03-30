import { Configuration, OpenAIApi } from "openai";
import axios from "axios";

export function ChatGPT (ctx){
    return new Promise(async(resolve, reject) => {
        const searchText = ctx.message.text.replace("/gpt", "").trim();
        const prompt = searchText;
 
        try {
            const configuration = new Configuration({
                apiKey: process.env.CHATGPT,
              });
              const openai = new OpenAIApi(configuration);
              const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                temperature: 0,
                max_tokens: 2048,
              });
            resolve(response.data.choices[0].text || "Дані чомусь прийшои пусті!");
        } catch (error) {
            console.log(error);
            resolve('Сталася помилка сереверу, або ліміт часу вичерпався!');
        }
    })
}