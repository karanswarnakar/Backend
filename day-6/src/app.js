const express = require('express'); 
const app = express()
require("dotenv").config()
app.use(express.json())

const NotesModel = require("./models/notes.model.js");


app.post("/api/notes", async (req,res)=>{
    console.log(req.body);
    
    const {title, decription} = req.body 
    const note = await NotesModel.create(
        {title, decription}
    )
    res.status(201).json({
        massage: "Note Created successfully",
        note
    })
})

app.get("/api/notes",async (req,res)=>{
    const notes = await NotesModel.find()
    console.log(notes);
    
    res.status(200).json({
        massage: "Fatch all Notes successfuly",
        notes
    }) 
})


module.exports = app