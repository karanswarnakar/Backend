const express = require('express');
const userRouter = express.Router()
const userController = require('../controllers/user.controller');
const identifyUser = require('../middlewares/auth.middleware');

userRouter.post("/follow/:username",identifyUser, userController.followUser)
userRouter.post("/unfollow/:username", identifyUser, userController.unfollowUser)



userRouter.patch("/update/status/accepted/:username", identifyUser, userController.acceptFollowerRequest)
userRouter.patch("/update/status/rejected/:username", identifyUser, userController.rejectFollowerRequest)

userRouter.get("/status/pending/:username", identifyUser, userController.userPendingFollower)

module.exports = userRouter