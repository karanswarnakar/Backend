import PostModel from "../models/post.model.js"
import LikeModel from "../models/like.model.js"
import ImageKit from "@imagekit/nodejs"
import { toFile } from "@imagekit/nodejs"

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

    const { caption } = req.body
    console.log(caption);

    const post = await PostModel.create({
        caption: caption,
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

/** * 
 * @route GET - /api/posts/like/:postId [protected]
 * @description Like a post by postId and check if the user has already liked the post 
 */

async function likeByPostId(req, res) {
    const postId = req.params.postId
    const username = req.user.username

    const post = await PostModel.findById({ _id: postId })

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        })
    }
    const isLike = await LikeModel.findOne({
        post: post._id,
        user: username
    })

    if (isLike) {
        return res.status(400).json({
            message: `Post already like by ${username}`
        })

    }

    const like = await LikeModel.create({
        post: post._id,
        user: username
    })


    res.status(201).json({
        message: "Post liked successfully",
        like
    })
}
async function disLikeByPostId(req, res) {
    const postId = req.params.postId
    const username = req.user.username

    const post = await PostModel.findById({ _id: postId })

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        })
    }

    let dislike;
    try {
        dislike = await LikeModel.findOneAndDelete({
            post: post._id,
            user: username
        })
    } catch (err) {
        res.status(400).json({
            message: `Post already disliked by ${username}`
        })
    }

    res.status(201).json({
        message: "Post disliked successfully",
        dislike
    })
}


async function getFeed(req, res) {

    const user = req.user

    const posts = await Promise.all((await PostModel.find().populate("user").lean())
        .map(async (post) => {
            const isLiked = await LikeModel.findOne({
                user: user.username,
                post: post._id
            })

            post.isLiked = Boolean(isLiked)

            return post
        }))

    res.status(200).json({
        message: "Posts fetch successfully",
        posts
    })
}

const postController = {
    createPost,
    getPostOfUser,
    getPostDetailsById,
    likeByPostId,
    disLikeByPostId,
    getFeed
}

export default postController;