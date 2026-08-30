import { useContext, useEffect } from "react"
import { getUserByUsername } from "../services/profile.api.js"
import { ProfileContext } from "../profile.context.jsx"


export const useProfile = () => {
    const context = useContext(ProfileContext)
    const {
        profile,
        setProfile,
        lodding,
        setLodding
    } = context


    const handleGetProfileByUsername = async ({ username }) => {
        setLodding(true)
        const data = await getUserByUsername({ username })

        setProfile(data.profile)
        setLodding(false)
    }


    return {
        profile,
        lodding,
        handleGetProfileByUsername
    }

}

