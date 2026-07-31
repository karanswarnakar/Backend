const express = require('express'); 
const app = express()
const cors = require('cors');
app.use(express.json())
app.use(cors())
require("dotenv").config()
const NoteModel = require('./models/notes.model.js');

// POST
app.post("/api/notes", async (req,res)=>{
    const {title, decription} = req.body
    const note = await NoteModel.create(
        {title,decription}
    )

    res.status(201).json({
        massage: "Note Craeted successfuly",
        note
    })
})

// GET
app.get("/api/notes", async (req,res)=>{
    const notes = await NoteModel.find()

    res.status(200).json({
        massage: "Note Craeted successfuly",
        notes
    })
})

// DELETE
app.delete("/api/notes/:id", async (req,res)=>{
    const id = req.params.id

    const note = await NoteModel.findByIdAndDelete(id)

    res.status(201).json({
        massage: `${id} is being deleted`,
        note
    })

})
// PATCH
app.patch("/api/notes/:id", async (req,res)=>{
    const id = req.params.id
    const {decription} = req.body

    const note = await NoteModel.findByIdAndUpdate(
        id,
        {decription},
        {new: true}
    )

    res.status(201).json({
        massage: `${id} is being Updated`,
        note
    })

})

module.exports = app