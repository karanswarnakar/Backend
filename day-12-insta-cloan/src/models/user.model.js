const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "User is required"],
        unique: [true, "User already exists"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    bio: {
        type: String
    },
    profile_image: {
        type: String,
        default: "https://ik.imagekit.io/icuoatuu2/default.avif"
    }
}, {
    timestamps: true,
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;