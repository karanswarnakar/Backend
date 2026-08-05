const express = require('express')
const postRouter = express.Router()

const postController = require('../controllers/post.controller.js');
const multer = require('multer')
const uplode = multer({ storage: multer.memoryStorage() })

postRouter.post("/", uplode.single("image"), postController.postController)

module.exports = {
    postRouter
}