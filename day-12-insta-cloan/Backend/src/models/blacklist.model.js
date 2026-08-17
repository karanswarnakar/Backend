const mongoose = require('mongoose');

const blackListSchema = new mongoose.Schema({
      token: {
          type: String,
          required: [true, "Token is required"],
          unique: [true, "Token unique need"],
      },
    
}, {
    timestamps: true,
});

const BlacklistModel = mongoose.model('Blacklist', blackListSchema);

module.exports = BlacklistModel;