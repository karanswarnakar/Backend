import mongoose from "mongoose";
import ConversationModel from "../models/conversation.model.js";
import MessageModel from "../models/message.model.js";
import UserModel from "../models/user.model.js";
import FollowModel from "../models/follow.model.js";
import { createNotification } from "../services/notifications.js";
import { emitToConversation, emitToUser } from "../services/socket.js";

async function listConversations(req, res) {
    const conversations = await ConversationModel.find({ participants: req.user.id })
        .populate({ path: "participants", select: "username profileImage isPrivate" })
        .populate({ path: "lastMessage", select: "sender text createdAt" })
        .sort({ updatedAt: -1 })
        .limit(50)
        .lean();
    return res.status(200).json({ conversations });
}

async function openConversation(req, res) {
    const recipient = await UserModel.findOne({ username: req.params.username })
        .select("_id username profileImage isPrivate")
        .lean();
    if (!recipient) return res.status(404).json({ message: "User not found" });
    if (recipient._id.toString() === req.user.id) {
        return res.status(400).json({ message: "You cannot message yourself" });
    }

    const participants = [req.user.id, recipient._id.toString()].sort();
    const participantKey = participants.join(":");
    let conversation = await ConversationModel.findOne({ participantKey });
    if (!conversation && recipient.isPrivate) {
        const followsRecipient = await FollowModel.exists({
            follower: req.user.username,
            followee: recipient.username,
            status: "accepted"
        });
        if (!followsRecipient) {
            return res.status(403).json({ message: "Follow this private account before messaging" });
        }
    }
    if (!conversation) {
        try {
            conversation = await ConversationModel.create({ participants, participantKey });
        } catch (error) {
            if (error.code !== 11000) throw error;
            conversation = await ConversationModel.findOne({ participantKey });
        }
    }
    await conversation.populate("participants", "username profileImage isPrivate");
    return res.status(200).json({ conversation });
}

async function listMessages(req, res) {
    const { conversationId } = req.params;
    const { cursor } = req.query;
    if (!mongoose.isValidObjectId(conversationId) || (cursor && !mongoose.isValidObjectId(cursor))) {
        return res.status(400).json({ message: "Invalid conversation or message cursor" });
    }
    const conversation = await ConversationModel.findOne({
        _id: conversationId,
        participants: req.user.id
    });
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });
    const filter = { conversation: conversation._id };
    if (cursor) filter._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    const messages = await MessageModel.find(filter)
        .populate({ path: "sender", select: "username profileImage" })
        .sort({ _id: -1 })
        .limit(51)
        .lean();
    const hasMore = messages.length > 50;
    const items = messages.slice(0, 50).reverse();
    if (!cursor) {
        await MessageModel.updateMany({
            conversation: conversation._id,
            sender: { $ne: req.user.id },
            readAt: null
        }, { $set: { readAt: new Date() } });
    }
    return res.status(200).json({
        messages: items,
        hasMore,
        nextCursor: hasMore ? items[0]?._id ?? null : null
    });
}

async function sendMessage(req, res) {
    const { conversationId } = req.params;
    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    if (!mongoose.isValidObjectId(conversationId)) {
        return res.status(400).json({ message: "Invalid conversation id" });
    }
    if (!text || text.length > 4000) {
        return res.status(400).json({ message: "Message must be 1 to 4000 characters" });
    }
    const conversation = await ConversationModel.findOne({
        _id: conversationId,
        participants: req.user.id
    });
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });

    const message = await MessageModel.create({
        conversation: conversation._id,
        sender: req.user.id,
        text
    });
    conversation.lastMessage = message._id;
    await conversation.save();
    await message.populate({ path: "sender", select: "username profileImage" });
    const recipientId = conversation.participants.find(id => id.toString() !== req.user.id);
    await createNotification({
        recipient: recipientId,
        actor: req.user.id,
        type: "message",
        conversation: conversation._id,
        message: text.slice(0, 120)
    });
    emitToUser(recipientId.toString(), "message:incoming", {
        conversationId: conversation._id.toString(),
        message
    });
    emitToConversation(conversation._id.toString(), "message:new", message);
    return res.status(201).json({ message });
}

export default { listConversations, openConversation, listMessages, sendMessage };
