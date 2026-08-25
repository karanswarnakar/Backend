const express = require('express');
const authRouter = express.Router()
const authController = require('../controllers/auth.controller.js');
const authUser = require('../middlewares/auth.middleware.js');

authRouter.post("/register", authController.register)
authRouter.post("/login", authController.login)

authRouter.get("/logout", authUser, authController.logout)
authRouter.get("/get-me", authUser, authController.getMe)



module.exports = authRouter
