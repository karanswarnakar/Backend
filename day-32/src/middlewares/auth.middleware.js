import { compare } from "bcrypt"
import jwt from "jsonwebtoken"

export function IdentifyUser(req, res, next) {
    const token = req.cookies.token

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decode

        next()

    }catch(err){
        return res.status(401).json({
            message: "Token is not authorize",
            success: false,
            msg: "Token is unauthorize"
        })
    }


}