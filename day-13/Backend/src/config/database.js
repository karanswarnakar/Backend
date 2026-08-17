const mongoose = require('mongoose');

const connectToDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(`MongoDB connection error: (${err})`))
}

module.exports = connectToDB;
