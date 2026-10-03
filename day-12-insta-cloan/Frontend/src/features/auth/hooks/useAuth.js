import { useContext } from "react"
import { AuthContext } from "../auth.context.jsx"
import { login, register, getMe, logout, saveOnboarding } from '../services/auth.api.js'

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handelRegister = async (username, email, password) => {
        setLoading(true)
        try {
            const res = await register(username, email, password)
            setUser(res.user)
            return res.user
        } catch (err) {
            console.error("Failed to register:", err)
            throw err
        } finally {
            setLoading(false)
        }
    }
    const handelLogin = async (username, password) => {
        setLoading(true)
        try {
            const res = await login(username, password)
            setUser(res.user)
            return res.user
        } catch (err) {
            console.error("Failed to log in:", err)
            throw err
        } finally {
            setLoading(false)
        }
    }
    const logoutHandle = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (err) {
            console.error("Failed to log out:", err)
            throw err
        } finally {
            setLoading(false)
        }
    }
    const hendelGetMe = async () => {
        setLoading(true);

        try {
            const data = await getMe();
            setUser(data.user ?? null);
            return data.user;
        } catch (error) {
            setUser(null);
            if (error.response?.status !== 401) {
                console.error("Failed to get the current user:", error)
            }
            return null;
        } finally {
            setLoading(false);
        }
    }

    const handleSaveOnboarding = async (responses) => {
        try {
            const data = await saveOnboarding(responses)
            setUser(data.user)
            return data.user
        } catch (error) {
            console.error("Failed to save onboarding responses:", error)
            throw error
        }
    }

    return {
        user,
        setUser,
        loading,
        handelLogin,
        handelRegister,
        logoutHandle,
        hendelGetMe,
        handleSaveOnboarding
    }

}