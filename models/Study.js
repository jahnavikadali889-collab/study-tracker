const mongoose = require("mongoose")

const studySchema = new mongoose.Schema({
  userId: String,
  subject: String,
  hours: Number,
  date: String
})

module.exports = mongoose.model("Study", studySchema)