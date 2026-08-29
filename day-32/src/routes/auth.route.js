import { Router } from "express"
import authController from "../controllers/auth.controller.js"
import { loginValidation, registerValidation } from "../validations/authValidation.js"
import { IdentifyUser } from "../middlewares/auth.middleware.js"
const authRouter = Router()


/** * 
 * @router POST /api/auth/register
 * @description Register a new user and send a confirmation email.
 * @access Public
 * @body {name, username, email, password}
 * 
 */
authRouter.post("/register", registerValidation, authController.register)


/** * 
 * @router POST /api/auth/login
 * @description Login user and set token in cookie.
 * @access Public
 * @body {username, email, password}
 * 
 */

authRouter.post("/login", loginValidation ,authController.login)


/** * 
 * @router GET /api/auth/get-me
 * @description  Get user data.
 * @access Public
 * @header {Authorization} - The token
 * 
 */

authRouter.get("/get-me", IdentifyUser ,authController.getMe)



/** * 
 * @router GET /api/auth/verify-email
 * @description Verify user email.
 * @access Public
 * @query {token} - The verification token sent in the email.
 */

authRouter.get("/verify-email", authController.verifyEmail)


export default authRouter

