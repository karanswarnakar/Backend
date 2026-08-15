const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
/**  
* @route POST - api/auth/register 
* @description  Register a new user save user to database and create a token and save in cookie
 */
async function register(req, res) {
    const { username, email, password, profileImage } = req.body;

    const isUserExist = await UserModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserExist) {
        return res.status(409).json({
            message: `User already exists with username or email`
        })
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
        username,
        email,
        password: hash,
        profileImage
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    return res.status(201).json({
        message: 'User created successfully',
        user: {
            username: user.username,
            email: user.email
        }
    })

}


/**  
* @route POST - api/auth/login 
* @description  login a user and create a token and save in cookie and return user data
* @function {username, email} any of this can use for login user
 */
async function login(req, res) {
    const { username, email, password } = req.body

    const user = await UserModel.findOne({
        $or: [
            { username },
            { email }
        ]
    }).select("+password")
    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if (!isPasswordMatch) {
        return res.status(409).json({
            message: `Invalid Password`
        })
    }
    if (!user) {
        return res.status(404).json({
            message: `User dose not exists with ${user.email ? "email" : "username"}`
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message: "User login successfully",
        user: {
            username: user.username,
            email: user.email
        }
    })
}


async function getMe(req, res) {
    const userId = req.user.id

    const user = await UserModel.findById({ _id: userId })

    return res.status(200).json({
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    })

}


module.exports = {
    register,
    login,
    getMe
}