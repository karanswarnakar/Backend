const mongoose = require('mongoose');
const identifyUser = require('../middlewares/auth.middleware');
const BlackList = require('./blacklist.model');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username must be unique"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email must be unique"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false
    }
}, {
    timestamps: true,
});


const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;