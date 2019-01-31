const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const isEmail = require("validator/lib/isEmail");
const { validateRegistration } = require("../middleware/validateRegistration");
const mongoose = require("mongoose");

/* GET users listing. */
router.get("/", (req, res, next) => {
  res.send("respond with a resource");
});

router.get("/register", (req, res, next) => {
  if (!req.user) {
    res.render("register");
  } else {
    res.render("register", {
      alertMessage: `<p>Someone else is logged in. Not you? <a href="/users/logout">logout</a>. It is you? <a href="/dashboard">Return to dashboard</a></p>`
    });
  }
});

router.post("/register", validateRegistration, (req, res, next) => {
  const { name, email, password } = req.body;

  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    name,
    email,
    password
  });

  user.save().then(user => {
    // allows to save the successmessage in res.locals
    req.flash("successMessage", "You are now registered and can log in");
    res.redirect("/users/login");
  });
});

router.get("/login", (req, res, next) => {
  console.log(req.user);
  if (!req.user) {
    res.render("login");
  } else {
    res.render("login", {
      // Superugly but ok...
      alertMessage: `<p>Someone else is logged in. Not you? <a href="/users/logout">logout</a>. It is you? <a href="/dashboard">Return to dashboard</a></p>`
    });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    // on success:
    successRedirect: "/dashboard",
    // on failure:
    failureRedirect: "/users/login",
    // message when leaving blank
    badRequestMessage: "Please fill in all fields",
    // flash message:
    failureFlash: true
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("successMessage", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
