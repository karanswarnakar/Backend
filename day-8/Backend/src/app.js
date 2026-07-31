const express = require("express");
const app = express()
const cors = require("cors");
const NoteModel = require("./models/note.model");
const path = require('path');
require("dotenv").config()

app.use(express.json())
app.use(cors())
app.use(express.static("./public"))

// POST
app.post("/api/notes", async (req,res)=>{
    
    const {title,decription} = req.body
    
    const note = await NoteModel.create({
        title,decription
    })

    res.status(201).json({
        massage: "Note created successfuly",
        note
    })
})

// GET
app.get("/api/notes", async (req,res)=>{

    const notes = await NoteModel.find()

    res.status(200).json({
        massage: "Note fatch successfuly",
        notes
    })

})

// Patch
app.patch("/api/notes/:id", async (req,res)=>{
    const id = req.params.id 
    const {decription} = req.body 
    const note = await NoteModel.findByIdAndUpdate(id,{
        decription
    })

    res.status(201).json({
        massage: "Note update successfuly",
        note
    })

})

//DELETE 
app.delete("/api/notes/:id", async (req,res)=>{
    const id = req.params.id
    const note = await NoteModel.findByIdAndDelete(id)

    res.status(200).json({
        massage: "Note deleted successfuly",
        note
    })
})


// PUT
app.put("/api/notes/:id", async (req,res)=>{
    const id = req.params.id 
    const {title,decription} = req.body 
    const note = await NoteModel.findByIdAndUpdate(id,{
        title,
        decription
    })

    res.status(201).json({
        massage: "Note update successfuly",
        note
    })

})

// WILD CARD API

app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app