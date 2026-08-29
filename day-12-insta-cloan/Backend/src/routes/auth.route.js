import express from 'express';

import authController from '../controllers/auth.controller.js'
import identifyUser from '../middlewares/auth.middleware.js'

const authRouter = express.Router();


/** *
* @route POST - api/auth/register 
* @description  Register a new user save user to database and create a token and save in cookie
* @access public
 */
authRouter.post("/register", authController.register)


/** *
* @route POST - api/auth/login 
* @description  login a user and create a token and save in cookie and return user data
* @access public
 */
authRouter.post("/login", authController.login)

/** *
* @route POST - api/auth/get-me 
* @description  Check if the user is authorized or not and return user data
* @access protected
 */
authRouter.get("/get-me", identifyUser, authController.getMe)

/** *
* @route POST - api/auth/logout 
* @description  Logout a user and remove token from cookie and return success message
* @access protected
 */
authRouter.get("/logout", identifyUser,authController.logout)


export default authRouter