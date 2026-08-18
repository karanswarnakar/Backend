const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
// const BlacklistModel = require('../models/blacklist.model');
const redis = require('../config/cache');
async function identifyUser(req, res, next) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Token is not provided."
        })
    }

    // const isBlacklisted = await BlacklistModel.findOne({
    //     token
    // })

    const isBlacklisted = await redis.get(token)
    
    if(isBlacklisted){
        res.clearCookies("token")
        return res.status(401).json({
            message:"Token is unauthorized"
        })
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decode

        next()
    } catch (err) {
        return res.status(401).json({
            message: "Token is not authorized"
        })
    }

}

module.exports = identifyUser





