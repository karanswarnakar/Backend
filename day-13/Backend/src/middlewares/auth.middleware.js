const jwt = require('jsonwebtoken');
const redis = require('../config/cache');

async function authUser(req,res, next) {
    
    const token = req.cookies.token
    
    if(!token){
        return res.status(400).json({
            message: "Token not provided."
        })    
    }
    const isBlacklisted = await redis.get(token)
    
    if(isBlacklisted){
        return res.status(401).json({
            message: "Token is not authorized."
        })
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decode

        next()
    }catch(err){
        return res.status(401).json({
            message: "Token is not authorized."
        })
    }


}
module.exports = authUser