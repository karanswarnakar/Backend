import { createContext, useEffect, useState } from "react";
import { getMe } from "./services/auth.api.js";



export const AuthContext = createContext()


export const AuthProvider = ({ children })=>{

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true;

        const restoreSession = async () => {
            try {
                const data = await getMe();
                if (isMounted) {
                    setUser(data.user ?? null);
                }
            } catch (error) {
                if (isMounted) {
                    setUser(null);
                }
                if (error.response?.status !== 401) {
                    console.error("Failed to restore the user session:", error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        restoreSession();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <AuthContext.Provider value={{user, setUser, loading, setLoading}}>
            {children}
        </AuthContext.Provider>
    )
}