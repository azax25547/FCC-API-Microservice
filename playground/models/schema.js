const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let learnSchema = new Schema({
  firstname: String,
  lastname: String,
  dateCreated: { type: Date, default: Date.now },
});

let Learn = mongoose.model("Learn", learnSchema);

module.exports = Learn;
