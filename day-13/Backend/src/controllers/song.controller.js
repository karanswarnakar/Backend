const SongModel = require('../models/song.model');
const uplodeServices = require('../services/storage.services');
const id3 = require('node-id3');


async function uplodeSong(req, res) {
    const songBuffer = req.file.buffer
    const mood = req.query.mood


    const tags = id3.read(songBuffer)
    // console.log(tags)

    const [songUplode, coverUplode] = await Promise.all([
        uplodeServices({
            buffer: songBuffer,
            fileName: tags.title + ".mp3",
            folder: "/projects/moodify/song"
        }),
        uplodeServices({
            buffer: tags.image.imageBuffer,
            fileName: tags.title + ".jpeg",
            folder: "/projects/moodify/cover"
        })
    ])

    const song = await SongModel.create({
        url: songUplode.url,
        posterUrl: coverUplode.url,
        title: tags.title,
        mood
    })

    return res.status(201).json({
        song
    })
}


async function getSong(req,res) {
    const {mood} = req.query

    const song = await SongModel.findOne({
        mood
    })

    res.status(200).json({
        song
    })

}
async function getMoodListSong(req,res) {
    const {mood} = req.query

    const song = await SongModel.find({
        mood
    })

    res.status(200).json({
        songs
    })

}
module.exports = {
    uplodeSong,
    getSong,
    getMoodListSong
}