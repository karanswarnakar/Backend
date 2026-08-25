import { useContext, useEffect } from "react"
import { login, register, logout, getMe } from "../services/auth.api"
import { AuthContext } from "../auth.context"


export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, lodding, setLodding } = context

    const handelLogin = async ({ email, password }) => {
        setLodding(true)
        const res = await login({ email, password })


        setUser(res.user)
        setLodding(false)
    }

    const handelRegister = async ({ username, email, password }) => {
        setLodding(true)
        const res = await register({ username, email, password })
        console.log(res);
        setUser(res.user)
        setLodding(false)
    }

    const handelGetMe = async () => {
        try {
            setLodding(true)
            const res = await getMe()
            setUser(res.user)
        } catch (err) {
            console.log(err)
        } finally {
            setLodding(false)
        }
    }

    const handelLogout = async () => {
        setLodding(true)
        const res = await logout()
        console.log(res.message);
        setUser(null)
        setLodding(false)
    }

    useEffect(() => {
        handelGetMe()
    }, [])

    return {
        user,
        lodding,
        handelLogin,
        handelRegister,
        handelGetMe,
        handelLogout
    }

}
