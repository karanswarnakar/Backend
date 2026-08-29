import express from 'express';
import userController from '../controllers/user.controller.js';
import identifyUser from '../middlewares/auth.middleware.js';

const userRouter = express.Router()

userRouter.post("/follow/:username",identifyUser, userController.followUser)
userRouter.post("/unfollow/:username", identifyUser, userController.unfollowUser)



userRouter.patch("/update/status/accepted/:username", identifyUser, userController.acceptFollowerRequest)
userRouter.patch("/update/status/rejected/:username", identifyUser, userController.rejectFollowerRequest)

userRouter.get("/status/pending/:username", identifyUser, userController.userPendingFollower)

export default userRouter