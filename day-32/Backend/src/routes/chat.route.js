import { Router } from "express"
import { getChats, getMessages, sendMessage } from '../controllers/chat.controller.js'
import { IdentifyUser } from "../middlewares/auth.middleware.js"
const chatRouter = Router()


chatRouter.post("/message", IdentifyUser, sendMessage)

chatRouter.get("/", IdentifyUser, getChats)
chatRouter.get("/:chatId", IdentifyUser, getMessages)

chatRouter.delete("/:chatId", IdentifyUser, deleteMessages)
chatRouter.delete("/:chatId", IdentifyUser, deleteChat)


export default chatRouter