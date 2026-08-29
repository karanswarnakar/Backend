import { Router } from "express"
import authController from "../controllers/auth.controller.js"
import { registerValidation } from "../validations/authValidation.js"
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
 * @router GET /api/auth/verify-email
 * @description Verify user email.
 * @access Public
 * @query {token} - The verification token sent in the email.
 */

authRouter.get("/verify-email", authController.verifyEmail)


export default authRouter

