var express = require("express");
var router = express.Router();
const { ensureAuthenticated } = require("../middleware/auth");
const User = require("./../models/User");
const Note = require("./../models/Note");
const mongoose = require("mongoose");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/dashboard", ensureAuthenticated, (req, res, next) => {
  res.render("dashboard", {
    allNotes: req.user.notes
  });
});

module.exports = router;
