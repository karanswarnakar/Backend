const PostModel = require('../models/post.models.js');
const ImageKit = require('@imagekit/nodejs');
const { toFile } = require('@imagekit/nodejs');
const jwt = require('jsonwebtoken')

const imagekit = new ImageKit({
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
})



const postController = async (req, res) => {
    /** *
     * {caption, imageUrl} = req.body
     * caption <- json 
     * image = dose not work with raw format {require: form-data}
     * need multer meiddelware  
     */

    console.log(req.body);
    console.log(req.file);

    const file = await imagekit.files.upload(
        {
            file: await toFile(Buffer.from(req.file.buffer), 'file'),
            fileName: "image",
            folder:"Instagram-Cloan/post"
        }
    )

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            massage: "Token is expaired"
        })
    }


    let decode = null;

    try {
        decode = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        res.status(401).json({
            massage: "User is not authorize"
        })
    }
   
    
    const post = await PostModel.create({
        caption: req.body.caption,
        postImage: file.url,
        userId: decode.id
    })

    res.status(201).json({
        massage: "Post created successfuly",
        post
    })

}

module.exports = {
    postController
}