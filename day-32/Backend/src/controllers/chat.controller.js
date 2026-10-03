import ChatModel from "../models/chat.model.js"
import MessageModel from "../models/message.model.js"
import { generateResponse, genetareTitel } from "../services/ai.service.js"


export async function sendMessage(req, res) {
    const { message, chat: chatId } = req.body


    let title = null;
    let chat = null;

    if (!chatId) {
        title = await genetareTitel(message)
        chat = await ChatModel.create({
            user: req.user.id,
            title
        })
    }
    const currentChatId = chatId || chat._id;

    console.log(currentChatId);

    const userMessage = await MessageModel.create({
        chat: currentChatId,
        content: message,
        role: "user"
    })

    const allMessage = await MessageModel.find({
        chat: currentChatId
    })



    const result = await generateResponse(allMessage)

    const aiMessage = await MessageModel.create({
        chat: currentChatId,
        content: result,
        role: "ai"
    })



    return res.status(200).json({
        chat,
        title,
        aiMessage
    })

}

export async function getChats(req, res) {
    const chats = await ChatModel.find({ user: req.user.id })

    return res.status(200).json({
        message: "Chat fetched successfully",
        chats
    })
}
export async function getMessages(req, res) {

    const { chatId } = req.params
    const userId = req.user.id

    const chat = await ChatModel.findOne({
        _id: chatId,
        user: userId
    })
    if (!chat) {
        return res.status(401).json({
            message: "You are not authorized to access this chat"
        })
    }

    const messages = await MessageModel.find({ chat: chatId })

    return res.status(200).json({
        message: "Messages fetched successfully",
        messages
    })
}

export async function deleteChat(req, res) {

    const { chatId } = req.params
    const userId = req.user.id

    const chat = await ChatModel.findOne({
        _id: chatId,
        user: userId

    })
    // console.log(chat);

    if (!chat) {
        return res.status(401).json({
            message: "You are not authorized to access this chat"
        })
    }

    const deleteChat = await ChatModel.findByIdAndDelete({
        _id: chatId
    })

    const deleteAllMessages = await MessageModel.deleteMany({
        chat: chatId
    })

    return res.json({
        message: "Chat and all associated messages deleted successfully"
    })

}

export async function deleteMessages(req, res) {
    const { msgId } = req.params
    console.log(msgId);

    const message = await MessageModel.findOne({
        _id: msgId
    })
    // console.log(message)
    const chat = await ChatModel.findOne({
        _id: message.chat
    })
    // console.log(chat)
    const isUserCreatedChat = chat.user.equals(req.user.id)
    console.log(isUserCreatedChat)
    if (!isUserCreatedChat) {
        return res.status(401).json({
            message: "You are not authorized to access this chat"
        })
    }

    const deleteMessage = await MessageModel.findByIdAndDelete({
        _id: message._id
    })
    // console.log(deleteMessage)
    return res.status(200).json({
        message: "Message deleted successfully"
    })
}