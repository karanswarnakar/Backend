const express = require("express")
const app = express()


app.use(express.json())
let notes = [
 
]



app.post("/notes", (req, res) => {
    console.log(req.body);
    notes.push(req.body)

    res.send("note created!✅")

})


app.get("/notes", (req, res) => {
    res.send(notes)
})

app.delete("/notes/:index", (req, res) => {

    delete notes[req.params.index - 1]
    res.send("note deleted ❎")
})

app.patch("/notes/:index", (req, res) => {
    notes[req.params.index - 1].dec = req.body.dec

    res.send("Note is Updated ✅")
})





module.exports = app