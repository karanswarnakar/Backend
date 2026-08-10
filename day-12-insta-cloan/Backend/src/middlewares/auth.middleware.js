const jwt = require('jsonwebtoken');

async function identifyUser(req,res,next) {
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message: "Token is not authorized"
        })
    }

    let decode; 
    try{
        decode = jwt.verify(token, process.env.JWT_SECRET)
    }catch(err){
        return res.status(401).json({
            message: "User is unauthorize"
        })
    }

    req.user = decode

    next()

}

module.exports = identifyUser