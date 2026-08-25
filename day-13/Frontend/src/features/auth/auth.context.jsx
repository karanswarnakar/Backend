import { createContext, useState } from "react";



export const AuthContext = createContext()

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null)
    const [lodding, setLodding] = useState(true)

    return (
        <AuthContext.Provider value={{user, setUser, lodding, setLodding}}>
            {children}
        </AuthContext.Provider>
    )
}