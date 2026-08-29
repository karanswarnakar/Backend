import express from 'express';

import postController from '../controllers/post.controller.js'
import identifyUser from '../middlewares/auth.middleware.js'
import multer from 'multer'

const postRouter = express.Router()

const uplode = multer({
    storage: multer.memoryStorage()
})



postRouter.post("/",identifyUser,uplode.single("postImage"),postController.createPost)

postRouter.get("/",identifyUser,postController.getPostOfUser)


postRouter.get("/details/:postId", identifyUser, postController.getPostDetailsById)

postRouter.post("/like/:postId", identifyUser, postController.likeByPostId)
postRouter.post("/dislike/:postId", identifyUser, postController.disLikeByPostId)

postRouter.get("/feed", identifyUser, postController.getFeed)

export default postRouter