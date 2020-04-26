const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const urlSchema = new Schema({
  original_url: String,
  short_url: { type: Number },
});

let Url = mongoose.model("Url", urlSchema);

module.exports = Url;
