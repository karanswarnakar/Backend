import mongoose from "mongoose";

const reshareSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

reshareSchema.index({ user: 1, post: 1 }, { unique: true });
reshareSchema.index({ createdAt: -1 });

export default mongoose.model("Reshare", reshareSchema);
