import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3000/api/songs",
    withCredentials: true
}) 


export async function uplodeSong({mood, file}) {
    const response = api.post("/", {
        mood,
        song: file
    })

    return response.data
}


export async function getSongByMood({mood}) {
    const response = await api.get(`/?mood=${mood}`)

    return response.data
}

export async function getMoodListSong({mood}) {
    const response = await api.get(`/?mood=${mood}`)

    return response.data
}



