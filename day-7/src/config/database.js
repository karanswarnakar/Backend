
const mongoose = require("mongoose")
function connectDB(){
     mongoose.connect("mongodb+srv://karan:Akc0EuJu11kdA0lq@cluster0.jk5mwjx.mongodb.net/day-7")
     .then(()=>{
        console.log("Connected DB successfully");
     })
     .catch(()=>{
        console.log("Error DB connection");
     })
}

module.exports = connectDB