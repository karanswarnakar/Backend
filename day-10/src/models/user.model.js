const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: [true, "With this email user account  already exists"],
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;