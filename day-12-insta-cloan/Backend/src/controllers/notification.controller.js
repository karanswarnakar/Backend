import mongoose from "mongoose";
import NotificationModel from "../models/notification.model.js";

async function getNotifications(req, res) {
    const cursor = req.query.cursor;
    if (cursor && !mongoose.isValidObjectId(cursor)) {
        return res.status(400).json({ message: "Invalid notification cursor" });
    }
    const filter = {
        recipient: req.user.id,
        $or: [
            { actor: { $ne: req.user.id } },
            { type: "privacy_update" }
        ]
    };
    if (cursor) filter._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    const notifications = await NotificationModel.find(filter)
        .populate({ path: "actor", select: "username profileImage" })
        .populate({ path: "post", select: "postImage caption" })
        .sort({ _id: -1 })
        .limit(21)
        .lean();
    const hasMore = notifications.length > 20;
    const items = notifications.slice(0, 20);
    const unreadCount = await NotificationModel.countDocuments({
        recipient: req.user.id,
        $or: [
            { actor: { $ne: req.user.id } },
            { type: "privacy_update" }
        ],
        readAt: null
    });
    return res.status(200).json({
        notifications: items,
        unreadCount,
        hasMore,
        nextCursor: hasMore ? items.at(-1)?._id ?? null : null
    });
}

async function markNotificationsRead(req, res) {
    const ids = req.body?.ids;
    const filter = { recipient: req.user.id, readAt: null };
    if (Array.isArray(ids)) {
        if (!ids.every(mongoose.isValidObjectId)) {
            return res.status(400).json({ message: "Invalid notification ids" });
        }
        filter._id = { $in: ids };
    }
    const result = await NotificationModel.updateMany(filter, { $set: { readAt: new Date() } });
    return res.status(200).json({ modifiedCount: result.modifiedCount });
}

export default { getNotifications, markNotificationsRead };
