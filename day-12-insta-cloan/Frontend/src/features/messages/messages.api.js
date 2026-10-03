import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/messages",
    withCredentials: true
});

export async function getConversations() {
    const response = await api.get("/conversations");
    return response.data;
}

export async function openConversation(username) {
    const response = await api.post(`/conversations/${encodeURIComponent(username)}`);
    return response.data;
}

export async function getMessages(conversationId, cursor) {
    const response = await api.get(`/conversations/${conversationId}/messages`, {
        params: cursor ? { cursor } : {}
    });
    return response.data;
}

export async function sendMessage(conversationId, text) {
    const response = await api.post(`/conversations/${conversationId}/messages`, { text });
    return response.data;
}
