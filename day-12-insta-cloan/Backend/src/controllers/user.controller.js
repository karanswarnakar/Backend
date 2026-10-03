import { createHash } from "node:crypto"
import FollowModel from "../models/follow.model.js"
import UserModel from "../models/user.model.js"
import PostModel from "../models/post.model.js"
import LikeModel from "../models/like.model.js"
import SavedPostModel from "../models/saved-post.model.js"
import { createNotification } from "../services/notifications.js"


async function followUser(req, res) {
    const follower = req.user.username;
    const followee = req.params.username;

    if (follower === followee) {
        return res.status(400).json({
            message: "You can't follow your self"
        })
    }

    const isFolloweeExists = await UserModel.findOne({ username: followee })
    if (!isFolloweeExists) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const isAlreadyFollowed = await FollowModel.findOne({ follower, followee })

    if (isAlreadyFollowed?.status === "rejected") {
        const follow = await FollowModel.findByIdAndUpdate(
            isAlreadyFollowed._id,
            { status: isFolloweeExists.isPrivate ? "pending" : "accepted" },
            { new: true }
        )
        await createNotification({
            recipient: isFolloweeExists._id,
            actor: req.user.id,
            type: follow.status === "pending" ? "follow_request" : "follow"
        })
        return res.status(201).json({
            message: follow.status === "pending"
                ? `Your follow request to ${followee} has been sent`
                : `You are now following ${followee}`,
            follow
        })
    }

    if (isAlreadyFollowed) {
        return res.status(400).json({
            message: "You are already following this user"
        })
    }

    const follow = await FollowModel.create({
        follower,
        followee,
        status: isFolloweeExists.isPrivate ? "pending" : "accepted"
    })
    await createNotification({
        recipient: isFolloweeExists._id,
        actor: req.user.id,
        type: follow.status === "pending" ? "follow_request" : "follow"
    })

    res.status(201).json({
        message: follow.status === "pending"
            ? `Your follow request to ${followee} has been sent`
            : `You are now following ${followee}`,
        follow
    })

}


async function unfollowUser(req, res) {
    const follower = req.user.username
    const followee = req.params.username


    if (follower === followee) {
        return res.status(400).json({
            message: `You cant unfollow your self`
        })
    }

    const isUserExists = await UserModel.findOne({ username: followee })

    if (!isUserExists) {
        return res.status(404).json({
            message: `User not found`
        })
    }

    const follow = await FollowModel.findOne({
        follower: follower,
        followee: followee
    })

    if (!follow) {
        return res.status(400).json({
            message: `You are not following so you can't unfollow ${followee}`
        })
    }

    const unfollow = await FollowModel.findByIdAndDelete({ _id: follow._id })

    res.status(200).json({
        message: `You have unfollowed ${followee}`,
        unfollow
    })

}


async function acceptFollowerRequest(req, res) {


    const follower = req.params.username // A
    const user = req.user.username // B

    const follow = await FollowModel.findOne({ follower: follower, followee: user })

    if (!follow) {
        return res.status(400).json({
            message: `You have no friend request from ${follower}`
        })
    }
    if (follow.status === "accepted") {
        return res.status(400).json({
            message: `You have already accepted ${follower} friend request`
        })
    }
    if (follow.status !== "pending") {
        return res.status(400).json({
            message: `There is no pending request from ${follower}`
        })
    }

    const acceptFollower = await FollowModel.findByIdAndUpdate(follow._id, {
        status: "accepted"
    }, { new: true })
    const followerUser = await UserModel.findOne({ username: follower }).select("_id")
    await createNotification({
        recipient: followerUser?._id,
        actor: req.user.id,
        type: "follow_accepted"
    })

    res.status(200).json({
        message: `Follower ${follower} add into to friendlist`,
        follower: acceptFollower
    })

}



async function rejectFollowerRequest(req, res) {
    const follower = req.params.username



    const isFollowerExists = await UserModel.findOne({ username: follower })

    if (!isFollowerExists) {
        return res.status(404).json({
            message: "User dose not exists"
        })
    }

    const isFollower = await FollowModel.findOne({
        follower,
        followee: req.user.username
    })

    if (!isFollower) {
        return res.status(400).json({
            message: `You have no friend request from ${follower}`
        })
    }
    if (isFollower.status === "rejected") {
        return res.status(400).json({
            message: `You have already rejected ${follower} friend request`
        })
    }
    if (isFollower.status !== "pending") {
        return res.status(400).json({
            message: `There is no pending request from ${follower}`
        })
    }

    const rejectFollower = await FollowModel.findByIdAndUpdate(isFollower._id, {
        status: "rejected"
    })
    res.status(200).json({
        message: `Follower ${follower} rejected`,
        follower: rejectFollower
    })
}



async function userPendingFollower(req, res) {
    const followee = req.params.username // a
    const user = req.user.username // a

    if (user !== followee) {
        return res.status(401).json({
            message: `You are not authorized to view pending follower list of ${followee}`
        })
    }


    const pendingList = await FollowModel.find({
        followee: user,
        status: "pending"
    }).sort({ createdAt: -1 }).lean()

    const followerUsers = await UserModel.find({
        username: { $in: pendingList.map(({ follower }) => follower) }
    }).select("username profileImage").lean()
    const usersByUsername = new Map(followerUsers.map(profile => [profile.username, profile]))

    return res.status(200).json({
        message: `Pending follower list of ${user} fetched successfully`,
        pendingList: pendingList.map(request => ({
            ...request,
            followerProfile: usersByUsername.get(request.follower) ?? null
        }))
    })
}

async function updatePrivacy(req, res) {
    if (typeof req.body?.isPrivate !== "boolean") {
        return res.status(400).json({ message: "isPrivate must be a boolean" })
    }
    const user = await UserModel.findByIdAndUpdate(
        req.user.id,
        { $set: { isPrivate: req.body.isPrivate } },
        { new: true, runValidators: true }
    ).select("_id username isPrivate")
    if (!user) return res.status(404).json({ message: "User not found" })
    return res.status(200).json({ user })
}

async function getFollowSuggestions(req, res) {
    const username = req.user.username
    const viewer = await UserModel.findById(req.user.id).select("onboarding.interests onboarding.goals").lean()
    const followedUsers = await FollowModel.find({
        follower: username,
        status: "accepted"
    }).select("followee").lean()
    const followedUsernames = followedUsers.map(({ followee }) => followee)
    const [existingRelations, users] = await Promise.all([
        FollowModel.find({
            follower: username,
            status: { $in: ["accepted", "pending"] }
        }).select("followee").lean(),
        UserModel.find({ username: { $ne: username } })
            .select("_id username profileImage onboarding.interests onboarding.goals")
            .sort({ createdAt: -1 })
            .limit(500)
            .lean()
    ])
    const excluded = new Set(existingRelations.map(({ followee }) => followee))
    const candidateUsernames = users
        .filter(candidate => !excluded.has(candidate.username))
        .map(({ username: candidateUsername }) => candidateUsername)
    const mutualCounts = new Map(
        followedUsernames.length && candidateUsernames.length
            ? (await FollowModel.aggregate([
                {
                    $match: {
                        follower: { $in: followedUsernames },
                        followee: { $in: candidateUsernames },
                        status: "accepted"
                    }
                },
                { $group: { _id: "$followee", count: { $sum: 1 } } }
            ])).map(({ _id, count }) => [_id, count])
            : []
    )
    const viewerInterests = new Set([
        ...(viewer?.onboarding?.interests || []),
        ...(viewer?.onboarding?.goals || [])
    ].map(value => value.toLowerCase()))

    const now = new Date()
    const day = now.toISOString().slice(0, 10)
    const refreshesAt = new Date(now)
    refreshesAt.setUTCDate(refreshesAt.getUTCDate() + 1)
    refreshesAt.setUTCHours(0, 0, 0, 0)
    const suggestions = users
        .filter(candidate => !excluded.has(candidate.username))
        .map(profile => ({
            ...profile,
            mutualCount: mutualCounts.get(profile.username) ?? 0,
            sharedInterestCount: [...new Set([
                ...(profile.onboarding?.interests || []),
                ...(profile.onboarding?.goals || [])
            ]
                .map(value => value.toLowerCase()))]
                .filter(value => viewerInterests.has(value)).length,
            dailyRank: createHash("sha256")
                .update(`${username}:${day}:${profile.username}`)
                .digest("hex")
        }))
        .sort((a, b) =>
            b.mutualCount - a.mutualCount ||
            b.sharedInterestCount - a.sharedInterestCount ||
            a.dailyRank.localeCompare(b.dailyRank)
        )
        .slice(0, 12)
        .map(({ dailyRank, sharedInterestCount, ...profile }) => ({ ...profile, sharedInterestCount }))

    return res.status(200).json({
        suggestions,
        refreshesAt: refreshesAt.toISOString()
    })
}

async function searchProfiles(req, res) {
    const query = typeof req.query.q === "string" ? req.query.q.trim() : ""
    if (!query || query.length > 80) {
        return res.status(400).json({ message: "Search query must contain 1 to 80 characters." })
    }

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const profiles = await UserModel.find({
        username: { $regex: escapedQuery, $options: "i" },
        ...(req.user ? { _id: { $ne: req.user.id } } : {})
    })
        .select("_id username profileImage bio isPrivate")
        .sort({ username: 1 })
        .limit(30)
        .lean()

    return res.status(200).json({ profiles })
}

async function getUserByUsername(req,res) {
    const username = req.params.username

    const profile = await UserModel.findOne({username})
        .select("_id username profileImage isPrivate createdAt")
        .lean()

    if(!profile){
        return res.status(404).json({
            message: "User not found."
        })
    }

    const viewerUsername = req.user?.username
    const viewerId = req.user?.id
    const [followRelation, followerCount, followingCount] = await Promise.all([
        viewerUsername
            ? FollowModel.findOne({ follower: viewerUsername, followee: username }).select("status").lean()
            : Promise.resolve(null),
        FollowModel.countDocuments({ followee: username, status: "accepted" }),
        FollowModel.countDocuments({ follower: username, status: "accepted" })
    ])
    const isOwner = viewerId === profile._id.toString()
    const canSeePrivate = !profile.isPrivate || isOwner || followRelation?.status === "accepted"
    const posts = canSeePrivate
        ? await PostModel.find({ user: profile._id }).sort({ createdAt: -1 }).lean()
        : []
    const postIds = posts.map(({ _id }) => _id)
    const [likes, savedPosts, likeCounts] = await Promise.all([
        viewerUsername
            ? LikeModel.find({ user: viewerUsername, post: { $in: postIds } })
            .select("post")
            .lean()
            : Promise.resolve([]),
        viewerId
            ? SavedPostModel.find({ user: viewerId, post: { $in: postIds } })
            .select("post")
            .lean()
            : Promise.resolve([]),
        LikeModel.aggregate([
            { $match: { post: { $in: postIds } } },
            { $group: { _id: "$post", count: { $sum: 1 } } }
        ])
    ])
    const likedIds = new Set(likes.map(({ post }) => post.toString()))
    const savedIds = new Set(savedPosts.map(({ post }) => post.toString()))
    const counts = new Map(likeCounts.map(({ _id, count }) => [_id.toString(), count]))
    const profilePosts = posts.map(post => ({
        ...post,
        user: profile,
        isLiked: likedIds.has(post._id.toString()),
        isSaved: savedIds.has(post._id.toString()),
        likes: counts.get(post._id.toString()) ?? 0
    }))

    res.status(200).json({
        message:"User fetch successfully.",
        profile: {
            ...profile,
            posts: profilePosts,
            followerCount,
            followingCount,
            followStatus: followRelation?.status ?? null,
            requiresFollow: profile.isPrivate && !canSeePrivate
        }
    })
    
}


const userController = {
    followUser,
    unfollowUser,
    acceptFollowerRequest,
    rejectFollowerRequest,
    userPendingFollower,
    getFollowSuggestions,
    searchProfiles,
    updatePrivacy,
    getUserByUsername
}

export default userController;