import { useContext } from "react"
import { AuthContext } from "../auth.context.jsx"
import { login, register, getMe } from '../services/auth.api.js'

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handelLogin = async (username, password) => {
        setLoading(true)
        try {
            const res = await login(username, password)
            setUser(res.user)
        } catch (err) {
            console.log(err);

        } finally {
            setLoading(false)
        }
    }
    const handelRegister = async (username, email, password) => {
        setLoading(true)
        try {
            const res = await register(username, email, password)
            setUser(res.user)
        } catch (err) {
            console.log(err);

        } finally {
            setLoading(false)
        }
    }

    return {
        user,
        loading,
        handelLogin,
        handelRegister
    }

}