const express = require('express');
const authRoute = express();

const authController = require('../controllers/auth.controller');
const identifyUser = require('../middlewares/auth.middleware');

authRoute.post("/register" ,authController.registerUser)
authRoute.post("/login" ,authController.loginUser)

authRoute.get("/get-me", identifyUser ,authController.getMe)
authRoute.get("/logout", authController.logoutUser)


module.exports = authRoute;
