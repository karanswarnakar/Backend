import { body, validationResult } from "express-validator"

const validator = (req,res, next) => {
    const error = validationResult(req);

    if(!error.isEmpty()){
        return res.status(400).json({
            message: "Validation error.",
            error: error.array()
        })
    }

    next()
}
export const registerValidation = [

    body("name").isString().withMessage("Name must be a string"),
    body("username").isLowercase().withMessage("Username must be lowercase"),
    body("email").isEmail().withMessage("Email must be a valid email"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/)
        .withMessage(
            "Password must contain uppercase, lowercase, number and special character"
        ),
    validator
] 

export const loginValidation = [
    body("username")
    .isString().withMessage("Username must be a string").optional(),
    body("email")
    .isEmail().withMessage("Email must be a valid email").optional(),
    body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),

    validator
]