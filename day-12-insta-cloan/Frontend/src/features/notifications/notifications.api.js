import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/notifications",
    withCredentials: true
});

export async function getNotifications(cursor) {
    const response = await api.get("/", { params: cursor ? { cursor } : {} });
    return response.data;
}

export async function markNotificationsRead(ids) {
    const response = await api.patch("/read", ids ? { ids } : {});
    return response.data;
}
