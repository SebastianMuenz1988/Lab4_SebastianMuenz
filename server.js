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
let currentID = "";

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
  if (currentJWT == "") {
    console.log("No access to this page with current role: ", currentRole);
    res.redirect("/identify");
  } else if (jwt.verify(currentJWT, process.env.TOKEN)) {
    next();
  } else {
    res.sendStatus(401);
  }
}

function authenticateStudent1(req, res, next) {
  if (currentJWT == "" || (currentRole !== "student1" && currentRole !== "teacher" && currentRole !== "admin")) {
    console.log("No access to this page with current role: ", currentRole);
    res.redirect("/identify");
  } else if (jwt.verify(currentJWT, process.env.TOKEN)) {
    next();
  } else {
    res.sendStatus(401);
  }
}

function authenticateStudent2(req, res, next) {
  if (currentJWT == "" || (currentRole !== "student2" && currentRole !== "teacher" && currentRole !== "admin")) {
    console.log("No access to this page with current role: ", currentRole);
    res.redirect("/identify");
  } else if (jwt.verify(currentJWT, process.env.TOKEN)) {
    next();
  } else {
    res.sendStatus(401);
  }
}

function authenticateStudent(req, res, next) {
  if (currentJWT == "" || (currentRole !== "student" && currentRole !== "teacher" && currentRole !== "admin")) {
    console.log("No access to this page with current role: ", currentRole);
    res.redirect("/identify");
  } else if (jwt.verify(currentJWT, process.env.TOKEN)) {
    next();
  } else {
    res.sendStatus(401);
  }
}

function authenticateTeacher(req, res, next) {
  if (currentJWT == "" || (currentRole !== "teacher" && currentRole !== "admin")) {
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
  } else if (currentJWT) {
    try {
      jwt.verify(currentJWT, process.env.TOKEN);
      next();
    } catch (error) {
      res.sendStatus(401);
    }
  } else {
    console.log("No access to this page with current role: ", currentRole);
    res.redirect("/identify");
  }
}

function authenticateUsers(req, res, next) {
  if (currentJWT == "" || (currentID !== req.params.userID && currentRole !== "admin")) {
    console.log("Your current ID does not match the requestesd Profile Page!");
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
  d;
});

app.get("/identify", (req, res) => {
  res.render("identify.ejs");
});

app.get("/student1", authenticateStudent1, (req, res) => {
  res.render("student1.ejs");
});

app.get("/student2", authenticateStudent2, (req, res) => {
  res.render("student2.ejs");
});

app.get("/student", authenticateStudent, (req, res) => {
  res.render("student.ejs");
});

app.get("/teacher", authenticateTeacher, (req, res) => {
  res.render("teacher.ejs");
});

app.get("/granted", authenticateUser, (req, res) => {
  if (currentRole === "admin") res.redirect("/admin");
  if (currentRole === "student1" || currentRole === "student2") res.redirect("/" + currentRole);
  if (currentRole === "student" || currentRole === "teacher") res.redirect("/users/" + currentID); // the enpoint grandet has a JWT check middleware
  else res.redirect("start.ejs");
  // res.render("start.ejs");
});

app.get("/users/:userID", authenticateUsers, async (req, res) => {
  let user = await database.getUserByID(req.params.userID);
  res.render("user.ejs", { user: user });
});

app.get("/admin", authenticateAdmin, async (req, res) => {
  let allUsers = await database.getAllUsers();
  res.render("admin.ejs", { users: allUsers });
});

app.post("/identify", async (req, res) => {
  console.log("req.body: ", req.body);

  // Check req.body
  if (!isValidUserObject(req.body)) {
    console.log("Bad user input!");
    res.status(401).redirect("/identify");
    return;
  }

  const { name, password } = req.body; //Destructuring the req.body

  // Check if user is in db and get user object
  let dbUserObject = await database.getUserByName(name);
  if (typeof dbUserObject === "undefined") {
    console.log("User is not registered!");
    res.status(401).redirect("/identify");
    return;
  }
  currentRole = dbUserObject.role;
  currentID = dbUserObject.userID;
  // Check compare with encrypted password from DB
  try {
    if (await bcrypt.compare(password, dbUserObject.password)) {
      const payload = {
        user: name,
        iat: Math.floor(Date.now() / 1000),
      };

      const secret = process.env.TOKEN;
      let options = {
        expiresIn: "1h",
      };

      // create JWT and save it to global variables for middleware check
      const JWT = jwt.sign(payload, secret, options);
      console.log("Your JWT: ", JWT);
      console.log("Your currentRole: ", currentRole);
      currentJWT = JWT;
      res.redirect("/granted");
    } else {
      console.log("Wrong password!");
      res.redirect("/identify");
      sdf;
    }
  } catch (error) {
    console.log("error compare: ", error);
  }
});

// app.post(“/register”) --> save user data in db (password encrypted)
app.post("/register", async (req, res) => {
  // Check req.body
  if (!isValidUserObject(req.body)) {
    console.log("Bad user input!");
    res.status(401).redirect("/register");
    return;
  }

  const { name, role, password } = req.body; //Destructuring the req.body

  if (!isValidPassword(password)) {
    res.status(401).redirect("/register");
    return;
  }

  if (await database.getUserByName(name)) {
    console.log("There is already a User with the name: ", name, "!");
    res.status(401).redirect("/register");
    return;
  }

  // Encryption of user password
  let passwordEncrypted;
  try {
    passwordEncrypted = await bcrypt.hash(password, 10); // encryption
    console.log("passwordEncrypted: ", passwordEncrypted); // log encrypted password
  } catch (error) {
    console.log("Could not encrypt user password: ", error);
  }

  // Define new id
  let allUsers = await database.getAllUsers();
  nextID = "id" + allUsers.length;
  console.log("nextID", nextID);
  console.log("name", name);

  // Save new User in DB
  // console.log("add user: ", name, role, passwordEncrypted);
  let status = await database.addUser(nextID, name, role, passwordEncrypted);
  console.log(status);
  //res.sendStatus(201); //.send("new user registered!");

  // After registering --> Redirect to \login
  req.method = "GET";
  res.redirect("/identify");
});

// Route 5 - app.get("/register")--> render register.ejs
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.listen(port, () => console.log(`Server is listening on port ${port}`));
