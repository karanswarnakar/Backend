const PostModel = require('../models/post.model');
const ImageKit = require('@imagekit/nodejs');
const { toFile } = require('@imagekit/nodejs');

const client = new ImageKit({
    privateKay: process.env.IMAGEKIT_PRIVATE_KEY
})
/** 
 * @route POST - /api/posts [protected]
 */
async function createPost(req, res) {
    const userId = req.user.id

    const file = await client.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), "file"),
        fileName: "postImage",
        folder: "Instagram-clone/post"
    })


    const post = await PostModel.create({
        caption: req.body.caption,
        user: userId,
        postImage: file.url
    })

    res.status(201).json({
        message: "Post created successfully",
        post
    })
}
/** 
 * @route GET - /api/posts [protected]
 */
async function getPostOfUser(req, res) {

    const userId = req.user.id

    const post = await PostModel.find({ user: userId })

    if (!post.length) {
        return res.status(404).json({
            message: "Post not found"
        })
    }

    res.status(200).json({
        message: "Post fetched successfully",
        post
    })


}
/** 
 * @route GET - /api/posts/details/:postId [protected]
 * @description Get post details by postId and check if the user is authorized to view the post
 */
async function getPostDetailsById(req, res) {
    const userId = req.user.id
    const postId = req.params.postId

    const post = await PostModel.findOne({ _id: postId })


    const isUserAuthorized = post.user.toString() === userId

    if (!isUserAuthorized) {
        return res.status(403).json({
            message: "Forbidden content"
        })
    }

    res.status(200).json({
        message: "Post fetched successfully",
        post
    })
}
module.exports = {
    createPost,
    getPostOfUser,
    getPostDetailsById
}
