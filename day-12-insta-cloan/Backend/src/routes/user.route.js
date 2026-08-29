import {Router} from 'express';
import userController from '../controllers/user.controller.js';
import identifyUser from '../middlewares/auth.middleware.js';

const userRouter = Router()


/** 
 * @route POST - /api/users/follow/:username 
 * @description Follow a user by username and check if the user is authorized to follow the user
 * @access protected
 */
userRouter.post("/follow/:username",identifyUser, userController.followUser)

/** * 
 * @route POST - /api/users/unfollow/:username 
 * @description Follow a user by username and check if the user is authorized to unfollow the user remove document from db
 * @access protected
 */
userRouter.post("/unfollow/:username", identifyUser, userController.unfollowUser)


/** * 
 * @route PATCH - /api/users/update/status/accepted/:username
 * @description update status ["accepted"] 
 * @access protected
 */
userRouter.patch("/update/status/accepted/:username", identifyUser, userController.acceptFollowerRequest)


/** * 
 * @route PATCH - /api/users/update/status/rejected/:username
 * @description update status ["rejected"] 
 * @access protected
 */
userRouter.patch("/update/status/rejected/:username", identifyUser, userController.rejectFollowerRequest)


/** * 
 * @route GET - /api/users/status/pending/:username
 * @description getting all pending status user ["pending"]
 * @access protected 
 */
userRouter.get("/status/pending/:username", identifyUser, userController.userPendingFollower)

export default userRouter