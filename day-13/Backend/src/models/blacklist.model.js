const mongoose = require('mongoose');

const blackListSchema = new mongoose.Schema({
    token:{
        type: String,
        required: [true, "token is required"],
        unique: [true, "unique is required"]
    }
}, {
    timestamps: true,
});



const BlacklistModel = mongoose.model('blacklist', blackListSchema);

module.exports = BlacklistModel;