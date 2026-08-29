import mongoose from 'mongoose';

const followSchema = new mongoose.Schema({
    follower: {
        type: String,
        required: [true, "Follower is required"]
    },
    followee: {
        type: String,
        required: [true, "Followee is required"]
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "accepted", "rejected"],
    }

}, {
    timestamps: true,
});

followSchema.index({follower: 1, followee: 1},{ unique:true})

const FollowModel = mongoose.model('Follow', followSchema);

export default FollowModel;