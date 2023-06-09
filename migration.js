// Run this only when creating the database and the tables
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./users.db"); //
// DB init
function init() {
  console.log("migration init() called");

  db.serialize(() => {
    //db.serialize each command inside is guaranteed to finish executing before the next one
    db.run("DROP TABLE IF EXISTS users"); //prevent from error if the table already exists

    db.run(
      `CREATE TABLE users (
      userID TEXT PRIMARY KEY UNIQUE,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      password TEXT NOT NULL
      )`,
      (error) => {
        if (error) console.error("error create table ", error);
      }
    );

    let users = [
      ["id1", "User1", "student1", "$2a$10$QQgzBmimtosOT2.ZwFKQu.5VTFfHEn3zBEVzoXQCB8/xKDsaMDLT."],
      ["id2", "User2", "student2", "$2a$10$NR/5Wib84h2OdHgTSXtYDeK2HhF8Du.xC93hkqSbWpsbfGysWMaxe"],
      ["id3", "User3", "teacher", "$2a$10$btMoexYklpxHnmhHoo2Wg.dr2ATSIfyI/0wz6O4IZNv5RPuJ1uGTy"],
      ["admin", "Admin", "admin", "$2a$10$2UfEEeOVEYe1ge6uetu0lewOMwPl3vDMfS1uFvFDSg1kya8QHXXDS"],
    ];

    let sql = `INSERT INTO users (userID, name, role, password) VALUES (?, ?, ?, ?)`;

    users.forEach((user) => {
      db.run(sql, user, (err) => {
        if (err) {
          console.error("error insert user ", user, err);
        }
      });
    });

    // db.close();
  });
}

module.exports = {
  init,
};
