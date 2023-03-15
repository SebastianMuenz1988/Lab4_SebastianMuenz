const sqlite3 = require("sqlite3").verbose(); //verboseverbose to produce long stack traces (more debug information)

const db = new sqlite3.Database("./users.db"); //

// get([param, ...] [, callback]) - returns single object or "undefined"
async function getUserByName(username) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE name = $name `, { $name: username }, (error, rows) => {
      if (error) reject(error);
      else resolve(rows);
    });
  });
}

async function getUserByID(userID) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE userID = $id `, { $id: userID }, (error, rows) => {
      if (error) reject(error);
      else resolve(rows);
    });
  });
}

// // all([param, ...] [, callback]) - returns an array of objects
// async function userExists(name) {
//   return new Promise((resolve, reject) => {
//     db.all(`SELECT * FROM users WHERE name = $name `, { $name: name }, (error, rows) => {
//       if (error) reject(error);
//       else resolve(rows.length > 0);
//     });
//   });
// }

// all([param, ...] [, callback]) - returns an array of objects
async function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM users`, (error, rows) => {
      if (error) reject(error);
      else resolve(rows);
    });
  });
}

// run(sql [, param, ...] [, callback]) - returns no data
async function addUser(nextID, username, role, passwordEncrypted) {
  const sql = `INSERT INTO users (userID, name, role, password) VALUES ($userID, $name, $role, $password)`;
  const params = { $userID: nextID, $name: username, $role: role, $password: passwordEncrypted };

  return new Promise((resolve, reject) => {
    db.run(sql, params, (error) => {
      if (error) reject(error);
      else resolve("Added User " + username + " to the Database");
    });
  });
}

module.exports = {
  getUserByName,
  getAllUsers,
  getUserByID,
  addUser,
  // userExists,
};
// setting the value of a property on a special object called module
// assign a object to the exports several properties
