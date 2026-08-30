import { createContext, useState } from "react";



export const ProfileContext = createContext()


export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null)
    const [lodding, setLodding] = useState(false)



    return (
        <ProfileContext.Provider value={{profile,setProfile,lodding,setLodding}}>
            {children}
        </ProfileContext.Provider>
    )


}