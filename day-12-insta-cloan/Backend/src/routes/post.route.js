import express from 'express';

import postController from '../controllers/post.controller.js'
import identifyUser, { optionalIdentifyUser } from '../middlewares/auth.middleware.js'
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

/**
 * @route GET /api/posts/details/:postId
 * @description Get a post owned by the authenticated user.
 * @access protected
 */
postRouter.get("/details/:postId", identifyUser, postController.getPostDetailsById)

postRouter.get("/explore", optionalIdentifyUser, postController.getExplorePosts)
postRouter.get("/public/:postId", optionalIdentifyUser, postController.getPostDetailsById)
postRouter.get("/profile/:username/reshares", optionalIdentifyUser, postController.getProfileReshares)
postRouter.get("/:postId/comments", optionalIdentifyUser, postController.getComments)
postRouter.post("/:postId/comments", identifyUser, postController.createComment)
postRouter.delete("/comments/:commentId", identifyUser, postController.deleteComment)
postRouter.post("/:postId/reshare", identifyUser, postController.toggleReshare)

/**
 * @route DELETE /api/posts/:postId
 * @description Delete an owned post and its likes and saved references.
 * @access protected
 */
postRouter.delete("/:postId", identifyUser, postController.deletePost)

/**
 * @route GET /api/posts/saved
 * @description List posts saved by the authenticated user.
 * @access protected
 */
postRouter.get("/saved", identifyUser, postController.getSavedPosts)

/**
 * @route POST /api/posts/:postId/save
 * @description Save a post for the authenticated user.
 * @access protected
 */
postRouter.post("/:postId/save", identifyUser, postController.savePost)

/**
 * @route DELETE /api/posts/:postId/save
 * @description Remove a post from the authenticated user's saved posts.
 * @access protected
 */
postRouter.delete("/:postId/save", identifyUser, postController.unsavePost)

/**
 * @route POST /api/posts/like/:postId
 * @description Like a post.
 * @access protected
 */
postRouter.post("/like/:postId", identifyUser, postController.likeByPostId)


/**
 * @route POST /api/posts/dislike/:postId
 * @description Remove the authenticated user's like from a post.
 * @access protected
 */
postRouter.post("/dislike/:postId", identifyUser, postController.disLikeByPostId)


/**
 * @route GET /api/posts/feed
 * @description Get the feed with like and saved-post state for the authenticated user.
 * @access protected
 */
postRouter.get("/feed", identifyUser, postController.getFeed)

export default postRouter