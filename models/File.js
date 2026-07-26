const mongoose = require("mongoose")

const fileSchema = new mongoose.Schema({

  userId: String,

  filename: String

})

module.exports = mongoose.model("File", fileSchema)