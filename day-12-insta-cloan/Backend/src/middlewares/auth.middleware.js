import jwt from 'jsonwebtoken';
import BlacklistModel from '../models/blacklist.model.js';

async function authenticate(req) {
    const token = req.cookies.token

    if(!token){
        return null
    }

    const isTokenBlacklisted = await BlacklistModel.findOne({
        token
    })
    if(isTokenBlacklisted){
        return null
    }
    try{
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch {
        return null
    }
}

async function identifyUser(req,res,next) {
    const user = await authenticate(req)
    if (!user) {
        return res.status(401).json({
            message: "User is unauthorized"
        })
    }

    req.user = user
    next()
}

export async function optionalIdentifyUser(req, _res, next) {
    req.user = await authenticate(req)
    next()
}

export default identifyUser