import FollowModel from "../models/follow.model.js"
import UserModel from "../models/user.model.js"


export async function followUser(req, res) {
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

    if (isAlreadyFollowed) {
        return res.status(400).json({
            message: "You are already following this user"
        })
    }

    const follow = await FollowModel.create({
        follower,
        followee
    })

    res.status(201).json({
        message: `You are now following ${followee}`,
        follow
    })

}


export async function unfollowUser(req, res) {
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


export async function acceptFollowerRequest(req, res) {


    const follower = req.params.username // A
    const user = req.user.username // B

    const follow = await FollowModel.findOne({ follower: follower, followee: user })

    if (!follow) {
        return res.status(400).json({
            message: `You have no friend request from ${follower}`
        })
    }
    if (follow.status = "accepted") {
        return res.status(400).json({
            message: `You have already accepted ${follower} friend request`
        })
    }

    const acceptFollower = await FollowModel.findByIdAndUpdate(follow._id, {
        status: "accepted"
    })

    res.status(200).json({
        message: `Follower ${follower} add into to friendlist`,
        follower: acceptFollower
    })

}



export async function rejectFollowerRequest(req, res) {
    const follower = req.params.username



    const isFollowerExists = await UserModel.findOne({ username: follower })

    if (!isFollowerExists) {
        return res.status(404).json({
            message: "User dose not exists"
        })
    }

    const isFollower = await FollowModel.findOne({ follower: follower })

    if (!isFollower) {
        return res.status(400).json({
            message: `You have no friend request from ${follower}`
        })
    }
    if (isFollower.status = "rejected") {
        return res.status(400).json({
            message: `You have already rejected ${follower} friend request`
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



export async function userPendingFollower(req, res) {
    const followee = req.params.username // a
    const user = req.user.username // a

    if (user != followee) {
        return res.status(401).json({
            message: `You are not authorized to view pending follower list of ${followee}`
        })
    }


    const pendingList = await FollowModel.find({
        $and: [
            { followee: user },
            { status: "pending" }
        ]
    })

    return res.status(200).json({
        message: `Pending follower list of ${user} fetched successfully`,
        pendingList
    })
}

const userController = {
    followUser,
    unfollowUser,
    acceptFollowerRequest,
    rejectFollowerRequest,
    userPendingFollower
}

export default userController;