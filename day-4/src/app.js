const express = require("express")
const app = express()
app.use(express.json())
let notes = []

app.get("/notes", (req, res) => {
    res.status(200).json({
        notes: notes
    })
})

app.post("/notes", (req, res) => {
    notes.push(req.body)
    res.status(201).json({
        massage: "Note insert Successfuly"
    })
})

app.delete("/notes/:idx", (req, res) => {
    let index = req.params.idx-1

    delete notes[index]

    res.status(201).json({
        massage: "Note Delete Successfuly"
    })
})

app.patch("/notes/:idx", (req, res) => {
    let index = req.params.idx-1

    notes[index].decription = req.body.decription 

    res.status(201).json({
        massage: "Note Updated Successfuly"
    })
})



module.exports = app