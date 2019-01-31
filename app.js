const path = require("path");

const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");

// database
require("./config/db");
// passport config
require("./config/passport")(passport);

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(helmet());
// layout.ejs on every page
app.use(expressLayouts);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// methodOverride needed to make PUT and DELETE methods in forms.
// takes a string as argument, which you pass in the query to let express know which one you want to use
// check note.ejs.
app.use(methodOverride("_method"));

// session needed for passport
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    unset: "keep",
    cookie: {
      secure: false,
      maxAge: 3600000
    }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// In order to use flash messages
app.use(flash());
// check out: https://stackoverflow.com/questions/23160743/how-to-send-flash-messages-in-express-4-0
app.use((req, res, next) => {
  res.locals.successMessage = req.flash("successMessage");
  // error is where passport puts their error messages
  res.locals.error = req.flash("error");
  res.locals.errorMessage = req.flash("errorMessage");
  res.locals.alertMessage = req.flash("alertMessage");
  //   console.log(res.locals);
  next();
});

// Router paths
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/", require("./routes/notes"));
app.use("/dashboard", require("./routes/notesOnDashboard"));

module.exports = app;
