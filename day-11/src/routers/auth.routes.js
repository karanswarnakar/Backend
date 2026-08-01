const express = require('express');
const UserModel = require('../models/user.model');
const authRouter = express.Router()
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
/*
 POST - /api/auth/register
*/
authRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body

    const isEmailAlreadyExist = await UserModel.findOne({ email })

    if (isEmailAlreadyExist) {
        return res.status(409).json({
            massage: `User already existe with this email:${email} account`,
            email
        })
    }
    const hash = crypto.createHash("MD5").update(password).digest("hex")

    const user = await UserModel.create({
        name, email, password:hash
    })

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET)

    res.cookie("jwt_token", token)

    res.status(201).json({
        massage: "User registered successfuly",
        user,
        token
    })

})


/*
 POST - /api/auth/cookie
*/
authRouter.post("/cookie", (req, res) => {
    res.status(200).json({
        massage: "Fetched all cookie",
        cookie: req.cookies
    })
})



/*
POST - /api/auth/login
also this function call "fat arrow", "callback", "async function", and Contoroles
*/

authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body

    const user = await UserModel.findOne({ email })
    if (!user) {
        return res.status(404).json({
            massage: "User with this email dose not existe"
        })
    }

    const isPasswordMatched = user.password === crypto.createHash("MD5").update(password).digest("hex")

    if (!isPasswordMatched) {
        return res.status(200).json({
            massage: "Invalid password"
        })
    }

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET)

    res.cookie("jwt_token", token)

    res.status(200).json({
        massage: "User login successfull",
        user
    })
})






module.exports = authRouter