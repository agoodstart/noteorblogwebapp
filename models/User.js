const mongoose = require("mongoose");
const isEmail = require("validator/lib/isEmail");
const bcrypt = require("bcryptjs");
const Note = require("./Note");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  email: {
    required: true,
    trim: true,
    type: String,
    unique: true,
    validate: isEmail,
    // No idea where to find message???
    message: res => `${res.value} is not a valid email`
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  notes: [{ type: Schema.Types.ObjectId, ref: "Note", autopopulate: true }]
});

UserSchema.pre("save", function(next) {
  const user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;

      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) throw err;

        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.plugin(require("mongoose-autopopulate"));

const User = mongoose.model("User", UserSchema);

module.exports = User;
