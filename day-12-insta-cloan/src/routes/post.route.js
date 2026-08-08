const express = require('express')
const postRouter = express.Router()

const postController = require('../controllers/post.controller.js');
const multer = require('multer')
const uplode = multer({ storage: multer.memoryStorage() })


/** * 
 *  POST - api/post/
 */
postRouter.post("/", uplode.single("postImage"), postController.createPostController)

/** * 
 * GET - api/post/
 * - fatch all post of this user
 */
postRouter.get("/", postController.getAllPostsController)

/** * 
 * GET - api/post/details/:postId
 * - details of a spacific post with the id and checks whether the post bellongs 
 *   to current user or not 
 */
postRouter.get("/details/:postId", postController.getSpecificPostByID)



module.exports = {
    postRouter
}