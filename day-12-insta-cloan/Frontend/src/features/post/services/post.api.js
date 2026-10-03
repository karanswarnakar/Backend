import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export async function getFeed(cursor) {
    const response = await api.get("/api/posts/feed", {
        params: cursor ? { cursor } : {}
    })
    return response.data
}

export async function getExplorePosts(cursor, query = "") {
    const response = await api.get("/api/posts/explore", {
        params: { ...(cursor ? { cursor } : {}), ...(query ? { q: query } : {}) }
    })
    return response.data
}

export async function getPublicPost(postId) {
    const response = await api.get(`/api/posts/public/${postId}`)
    return response.data
}

export async function getProfileReshares(username) {
    const response = await api.get(`/api/posts/profile/${encodeURIComponent(username)}/reshares`)
    return response.data
}

export async function getPostComments(postId, cursor) {
    const response = await api.get(`/api/posts/${postId}/comments`, {
        params: cursor ? { cursor } : {}
    })
    return response.data
}

export async function createPostComment(postId, text) {
    const response = await api.post(`/api/posts/${postId}/comments`, { text })
    return response.data
}

export async function deletePostComment(commentId) {
    const response = await api.delete(`/api/posts/comments/${commentId}`)
    return response.data
}

export async function togglePostReshare(postId) {
    const response = await api.post(`/api/posts/${postId}/reshare`)
    return response.data
}

export async function like(postId) {
    const response = await api.post("/api/posts/like/" + postId)
    
    return response.data
}
export async function dislike(postId) {
    const response = await api.post(`/api/posts/dislike/${postId}`)
    return response.data
}

export async function deletePost(postId) {
    const response = await api.delete(`/api/posts/${postId}`)
    return response.data
}

export async function savePost(postId) {
    const response = await api.post(`/api/posts/${postId}/save`)
    return response.data
}

export async function unsavePost(postId) {
    const response = await api.delete(`/api/posts/${postId}/save`)
    return response.data
}

export async function getSavedPosts() {
    const response = await api.get("/api/posts/saved")
    return response.data
}
export async function createPost(file, caption) {
    const formData = new FormData()
    
    
    formData.append("postImage", file)
    formData.append("caption", caption)
    
    const response = await api.post("/api/posts/",formData)
    
    return response.data
    
}
