const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default: ""
    },
    image_url: {
        type: String,
        required: [true, "Image url is required"],
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required: [true, "ObjectId is required"],
        ref:"User"
    }
}, {
    timestamps: true,
});

const PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;