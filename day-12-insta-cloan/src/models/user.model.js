const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: "https://ik.imagekit.io/a2vhcigch/default-dp.png"
    }
}, {
    timestamps: true,
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;