const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    decription: {
        type: String,
        required: true
    }
},{timestamps: true})

const NoteModel = mongoose.model("notes", noteSchema)

module.exports = NoteModel