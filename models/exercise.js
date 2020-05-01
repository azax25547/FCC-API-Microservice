const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exersiceSchema = new Schema({
  uid: { type: String },
  description: { type: String },
  duration: { type: Number },
  date: { type: Date },
});

const Exercise = mongoose.model("Exersice", exersiceSchema);

module.exports = Exercise;
