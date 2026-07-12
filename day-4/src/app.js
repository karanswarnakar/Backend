const express = require('express');
const app = express()
require("dotenv").config()
app.use(express.json())
let notes = []

// Create Note
app.post("/notes", (req,res)=>{
    console.log(req.body);
    
    notes.push(req.body)
    res.status(201).json(
        {
            massage: "Note Created",
            data: notes
        }
    )
})
// Fatch Notes
app.get("/notes", (req,res)=>{
    res.status(200).json(
        {
            massage: "Notes fatch successfuly",
            data: notes
        }
    )
})
// Delete Note
app.delete("/notes/:index", (req,res)=>{
    let index = req.params.index
    delete notes[index-1]
    
    res.status(200).json(
        {
            massage: `Note:${index} deleted successfully`,
            data: notes
        }
    )
})
// Titel Update of Note
app.patch("/notes/:index", (req,res)=>{
    let index = req.params.index
    let title = req.body.title
    notes[index-1].title = title

    res.status(200).json(
        {
            massage: `Note:${req.params.index} Titel Update`,
            data: notes
        }
    )

})



module.exports = app