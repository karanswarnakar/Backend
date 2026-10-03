import NotificationModel from "../models/notification.model.js";
import { emitToUser } from "./socket.js";

export async function createNotification({ recipient, actor, type, post = null, conversation = null, message = "", allowSelf = false }) {
    if (!recipient || !actor || (!allowSelf && recipient.toString() === actor.toString())) return null;
    const notification = await NotificationModel.create({
        recipient,
        actor,
        type,
        post,
        conversation,
        message
    });
    const populated = await notification.populate([
        { path: "actor", select: "username profileImage" },
        { path: "post", select: "postImage caption" }
    ]);
    emitToUser(recipient.toString(), "notification:new", populated);
    return populated;
}
