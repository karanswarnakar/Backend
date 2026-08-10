const express = require('express');
const postRouter = express.Router()
const postController = require('../controllers/post.controller');

const identifyUser = require('../middlewares/auth.middleware');

const multer = require('multer')

const uplode = multer({
    storage: multer.memoryStorage()
})



postRouter.post("/",identifyUser,uplode.single("postImage"),postController.createPost)

postRouter.get("/",identifyUser,postController.getPostOfUser)


postRouter.get("/details/:postId", identifyUser, postController.getPostDetailsById)


module.exports = postRouter