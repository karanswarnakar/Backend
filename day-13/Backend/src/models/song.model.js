const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    url: {
        type: String,
        required: [true, "Song url is required"]
    },
    posterUrl: {
        type: String,
        required: [true, "Song poster url is required"]
    },
    title: {
        type: String,
        required: [true, "Song title is required"]
    },
    mood: {
        type: String,
        required: [true, "Song mood is required"],
        enum: ["happy", "sad", "surprised"]
    }
}, { timeseries: true })


const SongModel = mongoose.model("Song", songSchema)

module.exports = SongModel;