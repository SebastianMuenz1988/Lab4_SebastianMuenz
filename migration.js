// Run this only when creating the database and the tables
const sqlite3 = require("sqlite3").verbose();

const file = "sqlite-database";
const db = new sqlite3.Database(file);

// DB init
function init() {
  db.serialize(() => {
    //db.serialize each command inside is guaranteed to finish executing before the next one
    db.run("DROP TABLE IF EXISTS users"); //prevent from error if the table already exists

    db.run(`CREATE TABLE users (
      username TEXT NOT NULL,
      password TEXT NOT NULL
      )`);
    // db.close() //
  });
}

module.exports = {
  init,
};
