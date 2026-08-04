const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const authRegister = async (req, res) => {

    const { username, email, password, bio, profileImage } = req.body

    const isUserExists = UserModel.findOne({
        $or: [
            { email },
            { username }
        ]
    })

    if (!isUserExists) {
        return res.status(409).json({
            massage: `User exists with this ${isUserExists.email ? "email account" : "username"} `
        })
    }
    const hash = crypto.createHash("MD5").update(password).digest("hex")
    const user = await UserModel.create({
        username, email, password: hash, bio, profileImage
    })

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.cookie("token", token)

    res.status(201).json({
        massage: "User register successfuly",
        user: {
            username: user.username,
            email: user.email
        }
    })

}

const authLogin = async (req, res) => {
    const { username, email, password } = req.body

    
    const user = await UserModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })
    
    if (!user) {
        return res.status(404).json({
            massage: `User not register with this ${user.email ? "email" : "username"} `
        })
    }
    
    const hash = crypto.createHash("MD5").update(password).digest("hex")
    
    const isPasswordMatch = (hash == user.password)
    
    if(!isPasswordMatch){
        return res.status(401).json({
            massage: "Invalid password"
        })
    }

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET, {expiresIn: "1d"})

    res.cookie("token", token)

    res.status(200).json({
        massage: "User login successfuly",
        user:{
            username: user.username,
            email: user.email,
        }
    })
}


module.exports = {
    authRegister,
    authLogin
}