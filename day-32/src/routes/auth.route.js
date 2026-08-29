import { Router } from "express"
import authController from "../controllers/auth.controller.js"
import { registerValidation } from "../validations/authValidation.js"
const authRouter = Router()

authRouter.post("/register", registerValidation, authController.register)



export default authRouter

