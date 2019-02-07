const mongoose = require("mongoose");
const User = require("./User");
const Schema = mongoose.Schema;
const moment = require("moment");

const NoteSchema = new mongoose.Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    autopopulate: true
  },
  noteTitle: {
    type: String,
    required: false
  },
  noteBody: {
    type: String,
    required: false
  },
  URL: {
    type: String
  }
});

NoteSchema.post("save", function(doc, next) {
  const note = this;

  this.model("User")
    .findById(note.author)
    .then(user => {
      user.notes.push(note);
      user.save().then(user => {
        next();
      });
    });
});

NoteSchema.pre("remove", function(next) {
  const note = this;

  this.model("User")
    .findById(note.author)
    .then(user => {
      user.notes = user.notes.filter(
        // I use toString method because objectIDs are objects,
        // and objects always reference a different space in memory,
        // even if they have the same value
        usernote => usernote._id.toString() !== note._id.toString()
      );
      return user;
    })
    .then(user => {
      user.save().then(user => {
        next();
      });
    })
    .catch(e => console.log(e));
});

// WITHOUT autopopulate, author would only reference the id.
// WITH autopopulate, author will refernce the entire document.
// Which will help later on(in case you want to loop through author names)
NoteSchema.plugin(require("mongoose-autopopulate"));

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
