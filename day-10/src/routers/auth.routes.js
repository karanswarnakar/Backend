const express = require('express');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/user.model');

const authRouter = express.Router()

authRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body

    const isEmailAlreadyExists = await UserModel.findOne({email})

    if(isEmailAlreadyExists){
        return res.status(409).json({
            massage: `User already exists with this email address`,
            email
        })
    }

    const user = await UserModel.create({
        name, email, password
    })

    const token = jwt.sign(
        {
            id: user._id,
            email:user.email
        },
        process.env.JWT_SECRET
    )
    
    res.cookie("jwt_token",token) 


    res.status(201).json({
        massage: `Usre:${name} created successfuly`,
        user,
        token
    })
})




module.exports = authRouter