import { Router } from "express";
import identifyUser from "../middlewares/auth.middleware.js";
import messageController from "../controllers/message.controller.js";

const router = Router();
router.use(identifyUser);
router.get("/conversations", messageController.listConversations);
router.post("/conversations/:username", messageController.openConversation);
router.get("/conversations/:conversationId/messages", messageController.listMessages);
router.post("/conversations/:conversationId/messages", messageController.sendMessage);

export default router;
