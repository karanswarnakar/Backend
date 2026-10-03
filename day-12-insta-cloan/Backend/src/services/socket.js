import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import BlacklistModel from "../models/blacklist.model.js";
import ConversationModel from "../models/conversation.model.js";

let io;
const onlineUsers = new Map();
const typingEvents = new Map();

export function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        },
        connectionStateRecovery: {
            maxDisconnectionDuration: 2 * 60 * 1000,
            skipMiddlewares: false
        }
    });

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.headers.cookie
                ?.split(";")
                .map(part => part.trim())
                .find(part => part.startsWith("token="))
                ?.slice("token=".length);
            if (!token || await BlacklistModel.exists({ token })) {
                return next(new Error("Authentication required"));
            }
            socket.data.user = jwt.verify(decodeURIComponent(token), process.env.JWT_SECRET);
            return next();
        } catch {
            return next(new Error("Authentication required"));
        }
    });

    io.on("connection", socket => {
        const { id, username } = socket.data.user;
        const sockets = onlineUsers.get(username) ?? new Set();
        sockets.add(socket.id);
        onlineUsers.set(username, sockets);
        socket.join(`user:${id}`);
        io.emit("presence:update", { username, online: true });

        socket.on("presence:request", () => {
            socket.emit("presence:snapshot", [...onlineUsers.keys()]);
        });

        socket.on("conversation:join", async ({ conversationId } = {}) => {
            if (typeof conversationId !== "string") return;
            const member = await ConversationModel.exists({
                _id: conversationId,
                participants: id
            });
            if (member) socket.join(`conversation:${conversationId}`);
        });

        socket.on("typing:update", async ({ conversationId, isTyping } = {}) => {
            if (typeof conversationId !== "string" || typeof isTyping !== "boolean") return;
            const member = await ConversationModel.exists({
                _id: conversationId,
                participants: id
            });
            if (!member) return;
            const key = `${socket.id}:${conversationId}`;
            const now = Date.now();
            if (isTyping && now - (typingEvents.get(key) ?? 0) < 800) return;
            typingEvents.set(key, now);
            socket.to(`conversation:${conversationId}`).emit("typing:update", {
                conversationId,
                username,
                isTyping
            });
        });

        socket.on("disconnect", () => {
            const activeSockets = onlineUsers.get(username);
            activeSockets?.delete(socket.id);
            if (!activeSockets?.size) {
                onlineUsers.delete(username);
                io.emit("presence:update", { username, online: false });
            }
            for (const key of typingEvents.keys()) {
                if (key.startsWith(`${socket.id}:`)) typingEvents.delete(key);
            }
        });
    });

    return io;
}

export function emitToUser(userId, event, payload) {
    io?.to(`user:${userId}`).emit(event, payload);
}

export function emitToConversation(conversationId, event, payload) {
    io?.to(`conversation:${conversationId}`).emit(event, payload);
}

