const mongoose = require('mongoose');
function connectToDB() {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log("MongoDB connected successfully"))
        .catch((err) => console.log("MongoDB connection error:", err))
}

module.exports = connectToDB