const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const redis = require('../config/cache');


async function register(req, res) {
    const { username, email, password } = req.body

    const isUserExist = await UserModel.findOne({
        username, email, password
    })

    if (isUserExist) {
        return res.status(400).json({
            message: "User exists with this username or email"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await UserModel.create({
        username,
        email,
        password:hash
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)

    return res.status(201).json({
        message: "User registered successfully.",
        user: {
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    })


}

async function login(req, res) {
    const { username, email, password } = req.body

    const user = await UserModel.findOne({
        $or: [
            { username },
            { email }
        ]
    }).select("+password")

    if (!user) {
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password)
    if (!isPasswordMatched) {
        return res.status(409).json({
            message: "Invalid credentials"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)
    
    return res.status(200).json({
        message: "User login successfully.",
        user: {
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    })

}

async function logout(req, res) {
    const userId = req.user.id
    const token = req.cookies.token

    const blacklist = await redis.set(token, Date.now().toString(), "EX", 60*60)

    res.clearCookie("token")

    return res.status(200).json({
        message: "User logout successfully."
    })


}

async function getMe(req, res) {
    const user = await UserModel.findOne({
        username: req.user.username
    })
    return res.status(200).json({
        message: "User fetch successfully.",
        user
    })
}

module.exports = {
    register,
    login,
    logout,
    getMe
};
