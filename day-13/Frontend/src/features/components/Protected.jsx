import React, { useEffect } from 'react'
import { useAuth } from '../auth/hooks/useAuth'
import { Navigate } from 'react-router'

const Protected = ({ children }) => {

    const { user, lodding } = useAuth()
  
    

    if (lodding) {
        return <h1>Lodding...</h1>
    }

    if (!user) {
        return <Navigate to="/login" />
    }

    return children
}

export default Protected
