const PostModel = require('../models/post.models.js');
const ImageKit = require('@imagekit/nodejs');
const {toFile} = require('@imagekit/nodejs');


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
            fileName: "image"
        }
    )

    res.send(file)


}   

module.exports = {
    postController
}