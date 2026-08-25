const mongoose = require("mongoose");
const { select } = require("../config/cache");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:[true, "Username is required"],
        unique:[true, "Username need to be unique"]
    },
    email:{
        type: String,
        required:[true, "Email is required"],
        unique:[true, "Email need to be unique"]
    },
    password:{
        type: String,
        required:[true, "Password is required"],
        select: false
    },
},{timeseries: true})

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel