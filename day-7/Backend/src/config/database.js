const mongoose = require('mongoose');

function connectToDB(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log(`MongoDB connected successfuly!`);
    })
    .catch((err)=>{
        console.log(`MongoDB connection error - > ${err}`)
    })
}

module.exports = connectToDB