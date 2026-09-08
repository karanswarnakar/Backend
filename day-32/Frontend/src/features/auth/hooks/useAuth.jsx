import { register, login, getMe } from "../services/auth.api.js";
import {setUser,setLodding, setError} from "../auth.slice.js"
import { useDispatch } from "react-redux";



export const useAuth = () => {
    const dispatch = useDispatch()

      
    const handleRegister = async ({ username, email, password }) => {
        try {
            dispatch(setLodding(true))
            const data = await register({ username, email, password })
        } catch (error) {
            dispatch(setError(error.response?.data?.message))
        } finally {
            dispatch(setLodding(false))
        }
    }
    const handleLogin = async ({ email, password }) => {
        try {
            dispatch(setLodding(true))
            const data = await login({ email, password })
            console.log(data.user);

            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.response?.data?.message))
        } finally {
            dispatch(setLodding(false))
        }
    }

    const handleGetMe = async () => {
        try {
            dispatch(setLodding(true))
            const data = await getMe()
            

            dispatch(setUser(data.user))
            

        } catch (error) {
            dispatch(setError(error.response?.data?.message))
        } finally {
            dispatch(setLodding(false))
        }
    }


    
    return {
        handleRegister,
        handleLogin,
        handleGetMe
    }

}

