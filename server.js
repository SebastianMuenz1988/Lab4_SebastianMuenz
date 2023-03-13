// imports
const express = require("express"); //import the express module - assigned to const "epxress"
const bcrypt = require("bcrypt"); //import the bcrypt module - assigned to const "bcrypt"
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const database = require("./database");
const migration = require("./migration");
migration.init();

const { isValidUserObject, isValidPassword } = require("./validation");

const app = express(); // assing const app to express() method
const port = 5000;

let currentJWT = "";
let currentRole = "";

app.set("view-engine"); // view templates
app.set("ejs"); // view templates

// Middleware
app.use(express.json());

// Middleware for checking requests
app.use((req, res, next) => {
  console.log(`req.method: ${req.method}  req url: ${req.url}  req body: `, req.body);
  next();
});

// Middleware function for identification
function authenticateUser(req, res, next) {
  if (currentJWT == "" || !(currentRole !== "student" || currentRole !== "admin")) {
    console.log("No access to this page with current role: ", currentRole);
    res.redirect("/identify");
  } else if (jwt.verify(currentJWT, process.env.TOKEN)) {
    next();
  } else {
    res.sendStatus(401);
  }
}

function authenticateAdmin(req, res, next) {
  if (currentJWT == "" || currentRole !== "admin") {
    console.log("No access to this page with current role: ", currentRole);
    res.redirect("/identify");
  } else if (jwt.verify(currentJWT, process.env.TOKEN)) {
    next();
  } else {
    res.sendStatus(401);
  }
}

app.use(express.urlencoded({ extended: false })); //only accept key-value pairs with string values

// Routes
app.get("/", (req, res) => {
  req.method = "GET";
  res.redirect("/identify");
});

app.get("/identify", (req, res) => {
  res.render("identify.ejs");
});

app.get("/granted", authenticateUser, (req, res) => {
  res.render("start.ejs");
});

app.get("/admin", authenticateAdmin, (req, res) => {
  res.render("admin.ejs");
});

app.post("/identify", async (req, res) => {
  // // Check if data valid
  // if (!isValidUserObject(req.body)) {
  //   console.log("Bad user input!");
  //   res.sendStatus(400);
  //   return;
  // }

  const username = req.body.user;
  const password = req.body.password;

  // Check if user is in DB
  let dbUserObject = await database.getUserData(username);
  if (typeof dbUserObject === "undefined") {
    console.log("User is not registered!");
    res.redirect("/identify");
    return;
  }

  // Get user role
  let role = dbUserObject.role;

  // Check compare with encrypted password from DB
  try {
    if (await bcrypt.compare(password, dbUserObject.password)) {
      const payload = {
        user: username,
        iat: Math.floor(Date.now() / 1000),
      };

      const secret = process.env.TOKEN;
      let options = {
        expiresIn: "1h",
      };

      // create JWT and save it to global variables for middleware check
      const JWT = jwt.sign(payload, secret, options);
      console.log("Your JWT: ", JWT);
      console.log("Your Role: ", role);
      currentJWT = JWT;
      currentRole = role;
      res.redirect("/granted"); // the enpoint grandet has a JWT check middleware
    } else {
      console.log("Wrong password!");
      res.redirect("/identify");
    }
  } catch (error) {
    console.log("error compare: ", error);
  }
});

app.listen(port, () => console.log(`Server is listening on port ${port}`));

// // Route 4 - app.post(“/REGISTER”) --> save user data in db (password encrypted)
// app.post("/REGISTER", async (req, res) => {
//   const { username, password } = req.body; //Destructuring the req.body
//   // Check user data
//   if (!isValidUserObject(req.body)) {
//     console.log("Bad user input!");
//     res.sendStatus(400);
//     return;
//   }

//   if (!isValidPassword(password)) {
//     res.sendStatus(400);
//     return;
//   }

//   if (!database.userExists(username)) {
//     console.log("User already exists!");
//     res.sendStatus(400);
//     return;
//   }

//   // Encryption of user password
//   let passwordEncrypted;
//   try {
//     passwordEncrypted = await bcrypt.hash(req.body.password, 10); // encryption
//     console.log("passwordEncrypted: ", passwordEncrypted); // log encrypted password
//   } catch (error) {
//     console.log("Could not encrypt user password: ", error);
//   }

//   // Save new User in DB
//   await database.addUser(username, passwordEncrypted);
//   //res.sendStatus(201); //.send("new user registered!");

//   // After registering --> Redirect to \login
//   req.method = "GET";
//   res.redirect("/LOGIN");
// });

// // Route 5 - app.get("/REGISTER")--> render register.ejs
// app.get("/REGISTER", (req, res) => {
//   res.render("register.ejs");
// });
