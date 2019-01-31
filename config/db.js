const mongoose = require("mongoose");

// I know i know, configuring db and connecting to db goes into 2 different files, but configuring db only has 1 line of code so....
process.env.MONGODB_URI = "mongodb://localhost:27017/NotesApp";

mongoose.Promise = global.Promise;
mongoose
  .connect(
    process.env.MONGODB_URI,
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

module.exports = {
  mongoose
};
