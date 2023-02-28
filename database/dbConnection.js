import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
/*Database connection */
export const db = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USERDB,
  database: process.env.DATABASE,
  password: process.env.PASS,
});

export async function saveDrinkData(obj) {
  try {
    await db.query(
      "INSERT INTO drinkList (title,description,rating,category) VALUES (?, ?, ?, ?)",
      [obj.title, obj.desc, obj.rating, obj.category]
    );
  } catch (error) {
    console.log(error);
  }
}

export function getDringsData(page) {
  return new Promise(async (resolve, reject) => {
    try {
      const [data] = await db.query(
        `SELECT * FROM drinkList LIMIT ${page*10}, 10;`
      );
      let text = "";
      data.forEach((item) => {
        text += `ID: ${item.id}\n`;
        text += `Назва: ${item.title}\n`;
        text += `Опис: ${item.description}\n`;
        text += `Рейтинг: ${item.rating}\n\n`;
        
      });

      resolve(text);
    } catch (error) {}
  });
}

export function searchDrinks(searchText, page) {
  return new Promise(async (resolve, reject) => {
    try {
      const [data] = await db.query(
        `SELECT * FROM drinkList WHERE title LIKE concat('%', ?, '%') OR category = ? LIMIT ${
          page * 5
        }, 5;`,
        [searchText.trim(), searchText.trim()]
      );
      let text = "";
      data.forEach((item) => {
        text += `Назва: ${item.title}\n`;
        text += `Опис: ${item.description}\n`;
        text += `Рейтинг: ${item.rating}\n\n`;
      });
      resolve(text);
    } catch (error) {}
  });
}

export function updateDrinkDescription(desc, id) {
    return db.query("update drinkList set `description` = concat( `description` , ?) where id = ?",[desc,id]);
}
