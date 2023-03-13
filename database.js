const sqlite3 = require("sqlite3").verbose(); //verboseverbose to produce long stack traces (more debug information)

const db = new sqlite3.Database("./users.db"); //

// get([param, ...] [, callback]) - returns single object or "undefined"
async function getUserData(username) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE name = $username `, { $username: username }, (error, rows) => {
      if (error) reject(error);
      else resolve(rows);
    });
  });
}

// all([param, ...] [, callback]) - returns an array of objects
async function userExists(username) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM users WHERE username = $name `, { $name: username }, (error, rows) => {
      if (error) reject(error);
      else resolve(rows.length > 0);
    });
  });
}

// run(sql [, param, ...] [, callback]) - returns no data
async function addUser(username, passwordEncrypted) {
  const sql = `INSERT INTO users (username, password) VALUES ($username, $password)`;
  const params = { $username: username, $password: passwordEncrypted };

  return new Promise((resolve, reject) => {
    db.run(sql, params, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

module.exports = {
  getUserData,
  addUser,
  userExists,
};
// setting the value of a property on a special object called module
// assign a object to the exports several properties
