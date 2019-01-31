const isEmail = require("validator/lib/isEmail");
const User = require("../models/User");

module.exports = {
  validateRegistration: function(req, res, next) {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
      errors.push({
        msg: "Please fill in all fields!"
      });
    }

    if (password.length < 6) {
      errors.push({
        msg: "Password should be at least 6 characters"
      });
    }

    if (password !== password2) {
      errors.push({
        msg: "Passwords do not match"
      });
    }

    if (!isEmail(email)) {
      errors.push({
        msg: "That is not a valid email"
      });
    }

    if (errors.length > 0) {
      res.render("register", {
        errors,
        name,
        email,
        password,
        password2
      });
    } else {
      User.findOne({ email }).then(user => {
        if (user) {
          errors.push({
            msg: "Email is already registered"
          });
          res.render("register", {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          return next();
        }
      });
    }
  }
};
