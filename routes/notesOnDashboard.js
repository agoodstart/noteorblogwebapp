var express = require("express");
var router = express.Router();
const { ensureAuthenticated } = require("../middleware/auth");
const User = require("./../models/User");
const Note = require("./../models/Note");
const { ObjectID } = require("mongodb");
const moment = require("moment");

router.get("/note/:id", async (req, res, next) => {
  const _id = req.params.id;

  await Note.findOne({ _id }).then(note => {
    const { noteTitle, noteBody, _id } = note;
    console.log("Url: " + req.originalUrl);

    res.render("Note", {
      noteTitle,
      noteBody,
      _id,
      URL: "/dashboard/note/"
    });
  });
});

router.post("/note/:id", async (req, res, next) => {
  console.log(req.originalUrl);
  const _id = req.params.id;
  console.log(req.body);
  // console.log(req);

  const { noteTitle, noteBody } = req.body;

  await Note.findByIdAndUpdate(
    _id,
    {
      $set: {
        noteTitle,
        noteBody
      }
    },
    {
      new: true
    }
  ).then(note => {
    res.set("Content-Type", "text/xml");
    res.render("Note", {
      noteTitle,
      noteBody,
      _id,
      URL: "/dashboard/note/"
    });
  });
});

router.delete("/note/:username/:notetitle", (req, res, next) => {
  const URL = `${req.params.username}/${req.params.notetitle}`;

  Note.findOne({ URL }, (err, model) => {
    if (err) {
      return;
    }

    model.remove(err => {
      if (err) {
        console.log(err);
      }
    });
  });
  res.redirect("/dashboard");
});

// -----------------------------------------------------

module.exports = router;
