import jwt from 'jsonwebtoken';
import BlacklistModel from '../models/blacklist.model.js';

async function identifyUser(req,res,next) {
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message: "Token is not authorized"
        })
    }

    const isTokenBlacklisted = await BlacklistModel.findOne({
        token
    })
    if(isTokenBlacklisted){
        return res.status(401).json({
            message: "Token is not authorized"
        })
    }
    try{
        
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode
        next()

    }catch(err){
        return res.status(401).json({
            message: "User is unauthorize"
        })
    }

    

}

export default identifyUser