const mongoose = require('mongoose');

const connectToDB = async ()=>{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDB connected successfully");
}

module.exports = connectToDB