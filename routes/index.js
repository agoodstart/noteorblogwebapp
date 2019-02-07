var express = require("express");
var router = express.Router();
const { ensureAuthenticated } = require("../middleware/auth");
const User = require("./../models/User");
const Note = require("./../models/Note");
const db = require("./../config/db");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/dashboard", ensureAuthenticated, (req, res, next) => {
  res.render("dashboard", {
    allNotes: req.user.notes
  });
});

router.post("/search", (req, res, next) => {
  console.log(req.body.searchValue);
  console.log(req.body.searchBy);
  const { searchValue, searchBy } = req.body;

  // selecting the whole database to query on,
  // then use the dynamic searchBy value to search through the correct model

  db.mongoose
    .model(searchBy)
    .find({
      $or: [
        { noteTitle: { $regex: RegExp(`${searchValue}*`) } },
        { name: { $regex: RegExp(`${searchValue}*`) } }
      ]
    })
    .then(
      result => {
        console.log(result);
        res.render("search", {
          searchResults: result,
          searchFilter: searchBy
        });
      },
      e => {
        console.log(e);
      }
    );
});

module.exports = router;
