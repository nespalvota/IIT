//import { Route, NavLink, HashRouter } from "react-router-dom";
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var morgan = require("morgan");
var User = require("./server/user");

// invoke an instance of express application.
var app = express();

// set our application port
app.set("port", 9000);

// set morgan to log info about our requests for development use.
app.use(morgan("dev"));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(
  session({
    key: "userID",
    secret: "somerandonstuffs",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000
    }
  })
);

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.userID && !req.session.user) {
    res.clearCookie("userID");
  }
  next();
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.userID) {
    res.redirect("/home");
  } else {
    next();
  }
};
/*
// route for Home-Page
app.get("/", sessionChecker, (req, res) => {
  res.redirect("./login");
});
*/
app.get("/", (req, res) => {
  res.redirect("./registration");
});

// route for user register
app
  .route("/registration")
  //.get(sessionChecker, (req, res) => {
  //  res.sendFile(__dirname + "/components/Registration.js");
  //})
  .post((req, res) => {
    let errors = {};
    try {
      if (!req.body.username) {
        //  throw "Username is required";
        res.status("400");
        errors["username"] = "Username is required.";
      } else if (!req.body.email) {
        res.status("400");
        res.send("Email is required.");
      } else if (!req.body.password) {
        res.status("400");
        res.send("Password is required.");
      } else if (!req.body.password2) {
        res.status("400");
        res.send("Repeated password is required.");
      } else if (req.body.password !== req.body.password2) {
        res.status("400");
        res.send("Passwords do not match.");
      } else {
        User.findOne({ where: { username: req.body.username } }).then(function(
          user
        ) {
          if (user) {
            res.status("400");
            res.send("Username is already taken. Take a different username.");
          } else {
            User.create({
              username: req.body.username,
              email: req.body.email,
              password: req.body.password
            })
              .then(user => {
                req.session.user = user.dataValues;
                res.redirect("/dashboard");
              })
              .catch(error => {
                res.redirect("/register");
              });
          }
        });
      }
    } catch (e) {
      console.log(e);
      // expected output: "Parameter is not a number!"
    }
  });
/*
// route for user Login
app
  .route("/login")
  .get(sessionChecker, (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
  })
  .post((req, res) => {
    var username = req.body.username,
      password = req.body.password;

    User.findOne({ where: { username: username } }).then(function(user) {
      if (!user) {
        res.redirect("/login");
      } else if (!user.validPassword(password)) {
        res.redirect("/login");
      } else {
        req.session.user = user.dataValues;
        res.redirect("/dashboard");
      }
    });
  });

// route for user's dashboard
app.get("/home", (req, res) => {
  if (req.session.user && req.cookies.userID) {
    res.sendFile(__dirname + "/public/dashboard.html");
  } else {
    res.redirect("/login");
  }
});

// route for user logout
app.get("/logout", (req, res) => {
  if (req.session.user && req.cookies.userID) {
    res.clearCookie("userID");
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});
*/
// route for handling 404 requests(unavailable routes)
app.use(function(req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

// start the express server
app.listen(app.get("port"), () =>
  console.log(`App started on port ${app.get("port")}`)
);
