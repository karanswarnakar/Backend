const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller');
const identifyUser =  require('../middlewares/auth.middleware');


authRouter.post("/register", authController.register)
authRouter.post("/login", authController.login)

authRouter.get("/get-me", identifyUser, authController.getMe)
authRouter.get("/logout", authController.logout)
module.exports = authRouter