import express from 'express';

import postController from '../controllers/post.controller.js'
import identifyUser from '../middlewares/auth.middleware.js'
import multer from 'multer'

const postRouter = express.Router()

const uplode = multer({
    storage: multer.memoryStorage()
})


/** * 
 * @route POST - /api/posts
 * @deprecated create post and check if the user is authorized to create it.
 * @access protected
 */
postRouter.post("/",identifyUser,uplode.single("postImage"),postController.createPost)


/** * 
 * @route GET - /api/posts
 * @description Get all posts of the user and check
 * @access protected
 */
postRouter.get("/",identifyUser,postController.getPostOfUser)

/** * 
 * @route GET - /api/posts/details/:postId 
 * @description Get post details by postId and check if the user is authorized to view the post
 * @access protected
 */
postRouter.get("/details/:postId", identifyUser, postController.getPostDetailsById)

/** * 
 * @route GET - /api/posts/like/:postId 
 * @description Like a post by postId and check if the user has already liked the post 
 * @access protected
 */
postRouter.post("/like/:postId", identifyUser, postController.likeByPostId)


/** * 
 * @route GET - /api/posts/dislike/:postId 
 * @description Unlike a post by postId and check if the user has already liked the post  
 * @access protected
 */
postRouter.post("/feed", identifyUser, postController.disLikeByPostId)


/** * 
 * @route GET - /api/posts/feed 
 * @description Get the feed of the user and check if the user is authorized to view the feed 
 * @access protected
 */
postRouter.get("/feed", identifyUser, postController.getFeed)

export default postRouter