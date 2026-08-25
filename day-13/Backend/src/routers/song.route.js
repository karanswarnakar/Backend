const express = require('express');

const songRouter = express.Router();
const songController = require('../controllers/song.controller.js');
const uplode = require('../middlewares/uplode.middleware.js');



songRouter.post("/", uplode.single("song"), songController.uplodeSong)
songRouter.get("/",songController.getSong)
songRouter.get("/",songController.getMoodListSong)

module.exports = songRouter;