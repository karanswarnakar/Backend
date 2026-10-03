import { useCallback, useContext, useRef } from "react"
import {
    acceptFollowerRequest,
    followUser,
    getUserByUsername,
    rejectFollowerRequest,
    unfollowUser
} from "../services/profile.api.js"
import { ProfileContext } from "../profile.context.jsx"


export const useProfile = () => {
    const context = useContext(ProfileContext)
    const {
        profile,
        setProfile,
        lodding,
        setLodding
    } = context
    const requestId = useRef(0)

    const handleGetProfileByUsername = useCallback(async ({ username }) => {
        const currentRequestId = ++requestId.current
        setLodding(true)
        try {
            const data = await getUserByUsername({ username })
            if (currentRequestId === requestId.current) {
                setProfile(data.profile)
            }
            return data.profile
        } catch (error) {
            if (currentRequestId === requestId.current) {
                setProfile(null)
            }
            console.error("Failed to load profile:", error)
            return null
        } finally {
            if (currentRequestId === requestId.current) {
                setLodding(false)
            }
        }
    }, [setLodding, setProfile])

    const handleToggleFollow = useCallback(async (username, followStatus) => {
        if (followStatus === "accepted" || followStatus === "pending") {
            await unfollowUser(username)
            setProfile(current => current?.username === username
                ? {
                    ...current,
                    followStatus: null,
                    followerCount: followStatus === "accepted"
                        ? Math.max(0, current.followerCount - 1)
                        : current.followerCount
                }
                : current
            )
            return null
        }

        const response = await followUser(username)
        const nextStatus = response.follow?.status ?? "pending"
        setProfile(current => current?.username === username
            ? {
                ...current,
                followStatus: nextStatus,
                followerCount: nextStatus === "accepted"
                    ? (current.followerCount ?? 0) + 1
                    : current.followerCount
            }
            : current
        )
        return nextStatus
    }, [setProfile])

    const handleAcceptFollowerRequest = useCallback(acceptFollowerRequest, [])
    const handleRejectFollowerRequest = useCallback(rejectFollowerRequest, [])

    return {
        profile,
        lodding,
        handleGetProfileByUsername,
        handleToggleFollow,
        handleAcceptFollowerRequest,
        handleRejectFollowerRequest
    }

}
