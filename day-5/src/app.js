const express = require("express")

const app = express()
app.use(express.json())

let notes = []




app.post("/notes", (req, res) => {
    notes.push(req.body)
  
    res.status(201).json({
        massage: "Note created successfully!"
    })
})
app.get("/notes", (req, res) => {
    res.status(200).json({
        notes: notes
    })
})
app.delete("/notes/:index", (req, res) => {
    let index = req.params.index - 1;
    delete notes[index]


    res.status(204).json({
        massage: "Note delete successfuly"
    })
})

app.patch("/notes/:index", (req, res) => {
    let index = req.params.index - 1;
    notes[index].decription = req.body.decription

    res.send("Data is Updated successfulty")
})
app.put("/notes/:index", (req, res) => {
    notes.push(req.body)
    res.send("Data got Puted")
})


module.exports = app