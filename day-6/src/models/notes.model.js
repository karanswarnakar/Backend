const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    
    title: String,
    decription: String

}, { timestamps: true })

const NotesModel = mongoose.model("notes", notesSchema)