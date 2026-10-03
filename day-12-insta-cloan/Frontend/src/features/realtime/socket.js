import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", {
    autoConnect: false,
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 8,
    reconnectionDelay: 700,
    reconnectionDelayMax: 5000
});

export function connectSocket() {
    if (!socket.connected) socket.connect();
    return socket;
}
