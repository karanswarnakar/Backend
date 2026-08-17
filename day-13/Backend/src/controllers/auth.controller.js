const UserModel = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BlacklistModel = require('../models/blacklist.model.js');



async function registerUser(req, res) {
    const { username, email, password } = req.body;

    const isUserExists = await UserModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserExists) {
        return res.status(400).json({
            message: "User already exists this username or email"
        })
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
        username,
        email,
        password: hash
    })
    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)
    res.status(201).json({
        message: "User created successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    })
}

async function loginUser(req, res) {
    const { username, email, password } = req.body
    const user = await UserModel.findOne({
        $or: [
            { username },
            { email }
        ]
    }).select("+password")

    if (!user) {
        return res.status(404).json({
            message: "User not found."
        })
    }
    const isPasswordMatch = bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        return res.status(401).json({
            message: "Invalid Password"
        })
    }
    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)

    res.status(200).json({
        message: "User login successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    })
}

async function getMe(req, res) {
    const decode = req.user

    const user = await UserModel.findById(decode.id)

    res.status(200).json({
        message: "User fetch successfully.",
        user
    })

}


async function logoutUser(req, res) {
    const token = req.cookies.token

    try {
        const blacklist = await BlacklistModel.create({
            token
        })

        return res.status(200).json({
            meassage: "User Logout successfully."
        })
    } catch (err) {
        return res.status(400).json({
            message: "User already logout."
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser
}





