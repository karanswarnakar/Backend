import axios from 'axios'   


const api = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true
})

export async function login(username, password) {
    const res = await api.post("/login",{
        username, password
    })
    return res.data
}
export async function register(username, email, password) {
    const res = await api.post("/register",{
        username,email,password
    })

    return res.data
}
export async function getMe() {
    const res = await api.get("/get-me")

    return res.data
}
export async function saveOnboarding(responses) {
    const res = await api.patch("/onboarding", responses)
    return res.data
}
export async function logout() {
    const res = await api.get("/logout")

    return res.data
}

