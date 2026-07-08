const express = require('express');
const app = express()
app.use(express.json())
require("dotenv").config()

notes = [

]

app.get("/notes", (req, res) => {
    res.status(200).json({
        massage: "Notes fatch successfuly",
        data: notes
    })
})
app.post("/notes", (req, res) => {
    notes.push(req.body)
    res.status(201).json(
        {
            massage: "New note added",
            data: notes
        }
    )
})
app.delete("/notes/:idx", (req, res) => {
    var id = req.params.idx
    delete notes[id - 1]
    res.status(201).json(
        {
            massage: `Note:${id} Deleted`,
            data: notes
        }
    )
})
app.put("/notes/:idx", (req, res) => {
    const id = req.params.idx
    let {title, decription} = req.body
    
    notes[id - 1].title = title 
    notes[id - 1].decription = decription
    

    res.status(200).json(
        {
            massage: `Note:${id} Updated`,
            data: notes
        }
    )
})




module.exports = app