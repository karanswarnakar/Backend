const mongoose = require("mongoose");

const notes = new mongoose.Schema({
    titel:String,
    decription:String
})

const notesModel = mongoose.model("Notes", notes);

module.exports = notesModel