const Note = require("../models/Note");

module.exports = {
  populate: function(req, res, next) {
    Note.schema.plugin(require("mongoose-autopopulate"));
    next();
  }
};
