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

app.set("view-engine"); // view templates
app.set("ejs"); // view templates

// Middleware
app.use(express.json());

// Middleware for checking requests
app.use((req, res, next) => {
  console.log(`req.method: ${req.method}  req url: ${req.url}  req body: `, req.body);
  next();
});

// Middleware for Identification
app.use((req, res, next) => {
  if (currentKey == "") {
    res.redirect("/identify");
  } else if (jwt.verify(currentKey, process.env.TOKEN)) {
    next();
  } else {
    res.redirect("/identify");
  }
});

app.use(express.urlencoded({ extended: false })); //only accept key-value pairs with string values

// Route 1 - app.get("/")--> only redirect to "/LOGIN"
app.get("/", (req, res) => {
  req.method = "GET";
  res.redirect("/LOGIN");
});

// Route 2 - app.post("LOGIN")--> login post (triggered from login.ejs form)
app.post("/LOGIN", async (req, res) => {
  console.log("Login_req.body: ", req.body);

  // Check if data valid
  if (!isValidUserObject(req.body)) {
    console.log("Bad user input!");
    res.sendStatus(400);
    return;
  }

  // username = req.body.username;
  // password = req.body.password;

  // Check if user is in DB
  let dbUserData = await database.getUserData(req.body.username);
  console.log(dbUserData);

  if (typeof dbUserData === "undefined") {
    console.log("User is not registered!");
    res.redirect("/LOGIN");
    return;
  }

  // Check compare with encrypted password from DB
  try {
    if (await bcrypt.compare(req.body.password, dbUserData.password)) {
      const payload = {
        user: req.body.username,
        iat: Math.floor(Date.now() / 1000),
      };
      const secret = process.env.TOKEN;
      let options = {
        expiresIn: "1h",
      };

      const token = jwt.sign(payload, secret, options);
      console.log("Your JWT: ", token);
      res.render("start.ejs");
    } else {
      console.log("Wrong password!");
      res.render("fail.ejs");
    }
  } catch (error) {
    console.log("error compare: ", error);
  }

  // If match --> create JASON Web Token + print it to console
});

// Route 3 - app.get("/LOGIN") --> only render login.ejs
app.get("/LOGIN", (req, res) => {
  res.render("login.ejs");
});

// Route 4 - app.post(“/REGISTER”) --> save user data in db (password encrypted)
app.post("/REGISTER", async (req, res) => {
  const { username, password } = req.body; //Destructuring the req.body
  // Check user data
  if (!isValidUserObject(req.body)) {
    console.log("Bad user input!");
    res.sendStatus(400);
    return;
  }

  if (!isValidPassword(password)) {
    res.sendStatus(400);
    return;
  }

  if (!database.userExists(username)) {
    console.log("User already exists!");
    res.sendStatus(400);
    return;
  }

  // Encryption of user password
  let passwordEncrypted;
  try {
    passwordEncrypted = await bcrypt.hash(req.body.password, 10); // encryption
    console.log("passwordEncrypted: ", passwordEncrypted); // log encrypted password
  } catch (error) {
    console.log("Could not encrypt user password: ", error);
  }

  // Save new User in DB
  await database.addUser(username, passwordEncrypted);
  //res.sendStatus(201); //.send("new user registered!");

  // After registering --> Redirect to \login
  req.method = "GET";
  res.redirect("/LOGIN");
});

// Route 5 - app.get("/REGISTER")--> render register.ejs
app.get("/REGISTER", (req, res) => {
  res.render("register.ejs");
});

// Route 6 - ADMIN
app.get("/admin", (req, res) => {
  res.render("admin.ejs");
});

// Server
app.listen(port, () => console.log(`Server is listening on port ${port}`));
