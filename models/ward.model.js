const mongoose = require("mongoose");

const wardSchema = new mongoose.Schema({
  wardNumber: String,
  capacity: Number,
  specializations: String,
});

const Ward = mongoose.model("Ward", wardSchema);

module.exports = { Ward };
