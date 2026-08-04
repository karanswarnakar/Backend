const express = require('express');
const { authRegister, authLogin } = require('../controllers/auth.controller');
const authRouter = express.Router()


authRouter.post("/register", authRegister)
authRouter.post("/login", authLogin)




module.exports = authRouter