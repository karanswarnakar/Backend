const express = require("express")
const app = express()
app.use(express.json())
const noteModel = require("./models/notes.model.js")


// - POST

app.post("/notes", async (req, res) => {
    const { titel, decription } = req.body

    const note = await noteModel.create({
        titel, decription
    })

    res.status(201).json({
        massage: "note created successfuly",
        note
    })

})
// - GET 

app.get("/notes", async (req,res)=>{
    const notes = await noteModel.find()

    res.status(200).json({
        massage: "Notes fatch seccessfully",
        notes
    })
})



module.exports = app