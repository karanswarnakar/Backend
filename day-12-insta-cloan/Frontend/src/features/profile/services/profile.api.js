import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3000/api/users",
    withCredentials: true
})

export async function getUserByUsername({username}) {
    
    const response = await api.get(`/${username}`)

    return response.data
}