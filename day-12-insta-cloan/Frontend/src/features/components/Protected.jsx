import React from 'react'
import {useNavigate} from 'react-router'
import { useAuth } from '../auth/hooks/useAuth'

const Protected = ({children}) => {
    const {user, loading } = useAuth()
    const navigate  = useNavigate()
    if(!user && loading){
        return navigate("/login")
    }else{
        return children
    }
}

export default Protected
