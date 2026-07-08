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
app.post("/notes", (req,res)=>{
    notes.push(req.body)
    res.status(201).json(
        {
            massage: "New note added",
            data: notes
        }
    )
})







module.exports = app