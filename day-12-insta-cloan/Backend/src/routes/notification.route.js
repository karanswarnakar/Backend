import { Router } from "express";
import identifyUser from "../middlewares/auth.middleware.js";
import notificationController from "../controllers/notification.controller.js";

const router = Router();
router.get("/", identifyUser, notificationController.getNotifications);
router.patch("/read", identifyUser, notificationController.markNotificationsRead);

export default router;
