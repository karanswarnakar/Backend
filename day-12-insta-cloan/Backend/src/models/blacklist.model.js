import mongoose from 'mongoose';

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

export default BlacklistModel;