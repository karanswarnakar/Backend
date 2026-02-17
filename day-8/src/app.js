

const express = require("express")
const NoteModel = require("./model/note.model.js")
const { default: mongoose } = require("mongoose")

const app = express()
app.use(express.json())


app.get("/notes", async (req, res) => {
    const notes = await NoteModel.find()

    res.status(200).json({
        massage: "Note Fatch Successflly",
        notes
    })
})

app.post("/notes", async (req, res) => {
    const { titel, decription } = req.body
    const notes = await NoteModel.create({
        titel: titel,
        decription: decription
    })

    res.status(201).json({
        massage: "Note Add in to Database Successflly",
        notes
    })
})

/*
            Error
            /
app.delete("notes/:id", async (req, res) => {
    const id = req.params.id;
   await NoteModel.findByIdAndDelete(id)
    res.status(200).json({
        massage: "Delete Successfully",
    })
})
*/


app.delete("/notes/:id", async (req, res) => {

    const id = req.params.id;
    await NoteModel.findByIdAndDelete(id);

    res.status(200).json({
        message: "Note deleted successfully",

    })
})



app.patch("/notes/:id", async (req,res)=>{
    await NoteModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    )

    res.status(200).json({
        massage: "Note Updated"
    })
})



module.exports = app