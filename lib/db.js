import mysql from "mysql2/promise";

// Settings for the one pool this app uses.
//
// connectionLimit: Vercel runs many small instances at once and the hosted
// database allows a small total, so each instance has to stay modest.
//
// timezone "Z": without this mysql2 reads a DATETIME in the machine time
// zone, so the same row would read differently on a laptop in India and on
// a server in the US. Everything we store is UTC.
const poolSettings = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
  timezone: "Z",
};

// I keep the pool on globalThis. Next.js reloads this file on every edit in
// development, and a plain variable would build a fresh pool each time until
// the database refuses any more connections.
function getPool() {
  if (!globalThis.vrtDatabasePool) {
    globalThis.vrtDatabasePool = mysql.createPool(poolSettings);
  }
  return globalThis.vrtDatabasePool;
}

// Every read and write in the app goes through here. A value always arrives
// in params and goes in through a ? placeholder, never joined into the text.
export async function runQuery(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}
