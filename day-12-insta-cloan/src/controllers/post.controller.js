const PostModel = require('../models/post.models.js');
const ImageKit = require('@imagekit/nodejs');
const { toFile } = require('@imagekit/nodejs');
const jwt = require('jsonwebtoken')

const imagekit = new ImageKit({
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
})



const createPostController = async (req, res) => {
    /** *
     * {caption, imageUrl} = req.body
     * caption <- json 
     * image = dose not work with raw format {require: form-data}
     * need multer middleware  
     */

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            massage: "Token is not authorized"
        })
    }


    let decode = null;

    try {
        decode = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return res.status(401).json({
            massage: "User is not authorized"
        })
    }


    const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: "postImage",
        folder: "Instagram-Cloan/post"
    })


    const post = await PostModel.create({
        caption: req.body.caption,
        postImage: file.url,
        userId: decode.id
    })

    res.status(201).json({
        massage: "Post created successfully",
        post
    })

}
const getAllPostsController = async (req, res) => {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            massage: "Token is not authorized"
        })
    }

    let decode;

    try {
        decode = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return res.status(401).json({
            massage: "Unauthorized Access"
        })
    }

    const userId = decode.id

    const post = await PostModel.find({ userId })

    if (!post) {
        return res.status(404).json({
            massage: "Post not found"
        })
    }



    return res.status(200).json({
        massage: "Post fatch successfully",
        post
    })



}

const getSpecificPostByID = async (req, res) => {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            massage: "Token is unauthorize"
        })
    }

    let decode;

    try {
        decode = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return res.status(401).json({
            massage: "User is unauthorize"
        })
    }

    const postId = req.params.postId
    const userId = decode.id

    const post = await PostModel.findById(postId);
    
    
    const isThisUserPost =  post.userId.toString() === userId

    if (!isThisUserPost) {
        return res.status(403).json({
            massage: "Forbidden content"
        })
    }

    res.status(200).json({
        massage: "Post fatch successfully",
        post
    })

}

module.exports = {
    createPostController,
    getAllPostsController,
    getSpecificPostByID
}