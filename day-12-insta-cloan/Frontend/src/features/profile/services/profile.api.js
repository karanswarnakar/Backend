import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3000/api/users",
    withCredentials: true
})

export async function getUserByUsername({username}) {
    
    const response = await api.get(`/profile/${encodeURIComponent(username)}`)

    return response.data
}

export async function searchProfiles(query) {
    const response = await api.get("/search", { params: { q: query } })
    return response.data
}

export async function updatePrivacy(isPrivate) {
    const response = await api.patch("/me/privacy", { isPrivate })
    return response.data
}

export async function followUser(username) {
    const response = await api.post(`/follow/${encodeURIComponent(username)}`)
    return response.data
}

export async function unfollowUser(username) {
    const response = await api.post(`/unfollow/${encodeURIComponent(username)}`)
    return response.data
}

export async function getPendingFollowers(username) {
    const response = await api.get(`/status/pending/${encodeURIComponent(username)}`)
    return response.data
}

export async function getFollowSuggestions() {
    const response = await api.get("/suggestions")
    return response.data
}

export async function getDailyFollowSuggestions(userId, force = false) {
    const key = `socially:suggestions:${userId}`
    if (!force) {
        try {
            const cached = JSON.parse(localStorage.getItem(key) || "null")
            if (cached?.refreshesAt && new Date(cached.refreshesAt).getTime() > Date.now()) {
                return cached
            }
        } catch (error) {
            console.warn("Could not read cached follow suggestions:", error)
        }
    }
    const data = await getFollowSuggestions()
    try {
        localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
        console.warn("Could not cache follow suggestions:", error)
    }
    return data
}

export function updateCachedFollowSuggestion(userId, username, followStatus) {
    const key = `socially:suggestions:${userId}`
    try {
        const cached = JSON.parse(localStorage.getItem(key) || "null")
        if (!cached?.suggestions) return
        cached.suggestions = cached.suggestions.map(profile => profile.username === username
            ? { ...profile, followStatus }
            : profile)
        localStorage.setItem(key, JSON.stringify(cached))
    } catch (error) {
        console.warn("Could not update cached follow suggestions:", error)
    }
}

export async function acceptFollowerRequest(username) {
    const response = await api.patch(`/update/status/accepted/${encodeURIComponent(username)}`)
    return response.data
}

export async function rejectFollowerRequest(username) {
    const response = await api.patch(`/update/status/rejected/${encodeURIComponent(username)}`)
    return response.data
}

export async function getPostOfUser() {
    
    const response = await api.get()
    console.log(response);
    return response.data
}