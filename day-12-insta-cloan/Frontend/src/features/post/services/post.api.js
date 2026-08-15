import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export async function getFeed() {
    const response = await api.get("/api/posts/feed")
    
   
    return response.data
}

export async function like(postId) {
    const response = await api.post("/api/posts/like/" + postId)
    
    return response.data
}
export async function dislike(postId) {
    const response = await api.post("/api/posts/dislike/" + postId)
    
    // console.log(response.data);
    return response.data
}
export async function createPost(file, caption) {
    const formData = new FormData()
    
    
    formData.append("postImage", file)
    formData.append("caption", caption)
    
    const response = await api.post("/api/posts/",formData)
    
    return response.data
    
}
export async function getMe() {
    try {
        const response = await api.get("/api/auth/get-me");
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            return null;
        }

        throw error;
    }
}