var express = require("express");
var router = express.Router();
const { ensureAuthenticated } = require("../middleware/auth");
const User = require("./../models/User");
const Note = require("./../models/Note");
const { ObjectID } = require("mongodb");

router.get("/note/create", (req, res, next) => {
  // url = note/create
  console.log("Url: " + req.originalUrl);
  res.render("Note", {
    noteTitle: "",
    noteBody: "",
    URL: req.originalUrl
  });
});

router.post("/note/create", (req, res, next) => {
  const user = req.user;
  const { noteTitle, noteBody } = req.body;

  const note = new Note({
    author: user._id,
    noteTitle,
    noteBody
  });

  note.save().then(note => {
    res.redirect(`/note/${note._id.toString()}`);
  });
});

router.get("/note/:id", (req, res, next) => {
  const _id = req.params.id;

  Note.findOne({ _id }).then(note => {
    console.log("Url: " + req.originalUrl);
    const { noteTitle, noteBody, _id } = note;

    res.render("Note", {
      noteTitle,
      noteBody,
      _id,
      URL: "/note/"
    });
  });
});

router.put("/note/:id", (req, res, next) => {
  const _id = req.params.id;
  const { noteTitle, noteBody } = req.body;

  Note.findByIdAndUpdate(
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
    res.redirect("/dashboard");
  });
});

router.delete("/note/:id", (req, res, next) => {
  const noteId = req.params.id;

  Note.findOne({ _id: noteId }, {}, { autopopulate: false }, (err, model) => {
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

module.exports = router;
