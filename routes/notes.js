var express = require("express");
var router = express.Router();
const { ensureAuthenticated } = require("../middleware/auth");
const User = require("./../models/User");
const Note = require("./../models/Note");
const { ObjectID } = require("mongodb");
const moment = require("moment");

router.get("/note/create", (req, res, next) => {
  res.render("createNote", {
    noteTitle: "",
    noteBody: ""
  });
});

router.post("/note/create", (req, res, next) => {
  const now = new moment().format("HHmmss");
  const user = req.user;
  const { noteTitle, noteBody } = req.body;
  // const URL = `${user.name}/${noteTitle} ${now}`.replace(/ /g, "_");

  const note = new Note({
    author: user._id,
    noteTitle,
    noteBody
    // URL
  });

  note.save().then(note => {
    res.redirect(`/note/${note._id.toString()}`);
  });
});

router.get("/note/:id", (req, res, next) => {
  const _id = req.params.id;

  Note.findOne({ _id }).then(note => {
    const { noteTitle, noteBody, _id } = note;

    res.render("updateNote", {
      noteTitle,
      noteBody,
      _id
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

  Note.findOne({ _id: noteId }, (err, model) => {
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

// router.get("/note/:username/:notetitle", (req, res, next) => {
//   const URL = `${req.params.username}/${req.params.notetitle}`;

//   Note.findOne({ URL }).then(note => {
//     const { noteTitle, noteBody, URL } = note;

//     res.render("updateNote", {
//       noteTitle,
//       noteBody,
//       URL
//     });
//   });
// });

// router.put("/note/:username/:notetitle", (req, res, next) => {
//   const URL = `${req.params.username}/${req.params.notetitle}`;
//   const now = new moment().format("HHmmss");

//   const { noteTitle, noteBody } = req.body;

//   Note.findOneAndUpdate(
//     { URL },
//     {
//       $set: {
//         noteTitle,
//         noteBody,
//         URL: `${req.params.username}/${noteTitle} ${now}`.replace(/ /g, "_")
//       }
//     },
//     {
//       new: true
//     }
//   ).then(note => {
//     res.redirect("/dashboard");
//   });
// });

// router.delete("/note/:username/:notetitle", (req, res, next) => {
//   const URL = `${req.params.username}/${req.params.notetitle}`;

//   Note.findOne({ URL }, (err, model) => {
//     if (err) {
//       return;
//     }

//     model.remove(err => {
//       if (err) {
//         console.log(err);
//       }
//     });
//   });
//   res.redirect("/dashboard");
// });
