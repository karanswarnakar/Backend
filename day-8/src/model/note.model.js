const mongoose = require("mongoose")


const noteSchema = mongoose.Schema(
    {
        titel:{
            type: String,
            require: true
        },
        decription:{
            type: String,
            require: true
        }
    }
)


const NoteModel = mongoose.model("Notes", noteSchema)

module.exports = NoteModel