import mongoose from 'mongoose';


const postSchema = new mongoose.Schema({
      caption: {
          type: String,
          default:"",
          required: [true, "Caption is required"] 
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
      },
      postImage:{
        type: String,
        required: [true, "PostImage is required"] 
      }
}, {
    timestamps: true,
});

const PostModel = mongoose.model('Post', postSchema);

export default PostModel;