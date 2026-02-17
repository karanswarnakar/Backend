const mongoose = require("mongoose")
require('dotenv').config()


function connectToDB() {
    mongoose.connect(process.env.MONGOO_DB_URI)
    .then(()=>{
        console.log("Connected to Database Successfuly");
    })
    .catch(()=>{
        console.log("Error! connected to database");
    })
}

module.exports = connectToDB