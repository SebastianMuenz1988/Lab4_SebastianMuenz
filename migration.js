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
      userID TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      role TEXT NOT NULL,
      password TEXT NOT NULL
      )`);
    // db.close() //

    let users = [
      ["id1", "User1", "student", "password"],
      ["id2", "User2", "student", "password2"],
      ["id3", "User3", "teacher", "password3"],
      ["admin", "Admin", "admin", "admin"],
    ];

    let sql = `INSERT INTO users (userID, name, role, password) VALUES (?, ?, ?, ?)`;

    users.forEach((user) => {
      db.run(sql, user, (err) => {
        if (err) {
          return console.error(err.message);
        }
      });
    });

    db.close();
  });
}

module.exports = {
  init,
};
