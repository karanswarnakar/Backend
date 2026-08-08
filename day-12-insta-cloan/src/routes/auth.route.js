const express = require('express');
const { authRegister, authLogin } = require('../controllers/auth.controller');
const authRouter = express.Router()

/** * 
 * POST - ap/auth/register
 */
authRouter.post("/register", authRegister)

/** * 
 * POST - ap/auth/login
 */
authRouter.post("/login", authLogin)




module.exports = authRouter