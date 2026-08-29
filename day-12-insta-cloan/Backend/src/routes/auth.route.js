import express from 'express';

import authController from '../controllers/auth.controller.js'
import identifyUser from '../middlewares/auth.middleware.js'

const authRouter = express.Router();

authRouter.post("/register", authController.register)
authRouter.post("/login", authController.login)

authRouter.get("/get-me", identifyUser, authController.getMe)
authRouter.get("/logout", authController.logout)


export default authRouter