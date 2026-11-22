import mysql from "mysql2/promise";

// A hosted MySQL refuses a connection that is not encrypted, and the MySQL
// on this machine has no certificate worth checking. So SSL is on for every
// host except this one.
//
// I look for the words rather than parsing the string. A password with an @
// or a : in it breaks a URL parser, and the error it throws points nowhere
// near the real problem.
function sslSetting() {
  const url = process.env.DATABASE_URL || "";

  if (url.includes("@localhost") || url.includes("@127.0.0.1")) {
    return undefined;
  }
  return { minVersion: "TLSv1.2" };
}

// Settings for the one pool this app uses.
//
// uri: mysql2 reads the host, port, user, password and database name out of
// the connection string itself. One value to set instead of five, which is
// one chance to mistype instead of five.
//
// connectionLimit: Vercel runs many small instances at once and the hosted
// database allows a small total, so each instance has to stay modest.
//
// timezone "Z": without this mysql2 reads a DATETIME in the machine time
// zone, so the same row would read differently on a laptop in India and on
// a server in the US. Everything we store is UTC.
const poolSettings = {
  uri: process.env.DATABASE_URL,
  connectionLimit: 5,
  timezone: "Z",
  ssl: sslSetting(),
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

// The same as runQuery, for a question that ends in LIMIT ? OFFSET ?.
//
// MySQL refuses a ? inside LIMIT when the statement is prepared on the
// server, and answers "Incorrect arguments to LIMIT". query() sends the very
// same ? placeholders but fills them in the driver, where mysql2 escapes
// every value. So nothing is joined into the text by hand here either.
export async function runPagedQuery(sql, params = []) {
  const [rows] = await getPool().query(sql, params);
  return rows;
}

// mysql2 hands back [rows, fields]. Only the rows matter here, exactly like
// runQuery above.
async function askOn(connection, sql, params) {
  const [rows] = await connection.execute(sql, params);
  return rows;
}

// Every lead write runs in here. Commit, rollback and release sit in one
// place, because a connection that is never released is gone for good and
// this pool is only five wide.
//
// The work is handed an "ask" bound to this one connection. Calling runQuery
// inside would borrow a second connection and run outside the transaction,
// which is the quiet version of this bug.
export async function runInTransaction(work) {
  const connection = await getPool().getConnection();
  const ask = (sql, params = []) => askOn(connection, sql, params);

  try {
    await connection.beginTransaction();
    const answer = await work(ask);
    await connection.commit();
    return answer;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
