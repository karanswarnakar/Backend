import PostModel from "../models/post.model.js"
import LikeModel from "../models/like.model.js"
import SavedPostModel from "../models/saved-post.model.js"
import CommentModel from "../models/comment.model.js"
import ReshareModel from "../models/reshare.model.js"
import FollowModel from "../models/follow.model.js"
import UserModel from "../models/user.model.js"
import { createNotification } from "../services/notifications.js"
import mongoose from "mongoose"
import ImageKit from "@imagekit/nodejs"
import { toFile } from "@imagekit/nodejs"

const client = new ImageKit({
    privateKay: process.env.IMAGEKIT_PRIVATE_KEY
})

async function decoratePosts(posts, user) {
    if (!posts.length) return []
    const postIds = posts.map(({ _id }) => _id)
    const [likes, savedPosts, likeCounts, commentCounts, reshareCounts, reshares] = await Promise.all([
        user
            ? LikeModel.find({ user: user.username, post: { $in: postIds } }).select("post").lean()
            : Promise.resolve([]),
        user
            ? SavedPostModel.find({ user: user.id, post: { $in: postIds } }).select("post").lean()
            : Promise.resolve([]),
        LikeModel.aggregate([
            { $match: { post: { $in: postIds } } },
            { $group: { _id: "$post", count: { $sum: 1 } } }
        ]),
        CommentModel.aggregate([
            { $match: { post: { $in: postIds } } },
            { $group: { _id: "$post", count: { $sum: 1 } } }
        ]),
        ReshareModel.aggregate([
            { $match: { post: { $in: postIds } } },
            { $group: { _id: "$post", count: { $sum: 1 } } }
        ]),
        user
            ? ReshareModel.find({ user: user.id, post: { $in: postIds } }).select("post").lean()
            : Promise.resolve([])
    ])
    const ids = records => new Set(records.map(({ post }) => post.toString()))
    const counts = records => new Map(records.map(({ _id, count }) => [_id.toString(), count]))
    const likedIds = ids(likes)
    const savedIds = ids(savedPosts)
    const resharedIds = ids(reshares)
    const likesByPost = counts(likeCounts)
    const commentsByPost = counts(commentCounts)
    const resharesByPost = counts(reshareCounts)

    return posts.map(post => ({
        ...post,
        isLiked: likedIds.has(post._id.toString()),
        isSaved: savedIds.has(post._id.toString()),
        isReshared: resharedIds.has(post._id.toString()),
        likes: likesByPost.get(post._id.toString()) ?? 0,
        commentCount: commentsByPost.get(post._id.toString()) ?? 0,
        reshareCount: resharesByPost.get(post._id.toString()) ?? 0
    }))
}

async function userCanViewPost(post, user) {
    if (!post.user?.isPrivate || user?.id === post.user._id.toString()) return true
    if (!user) return false
    return Boolean(await FollowModel.exists({
        follower: user.username,
        followee: post.user.username,
        status: "accepted"
    }))
}



async function createPost(req, res) {
    const userId = req.user.id

    const file = await client.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), "file"),
        fileName: "postImage",
        folder: "Instagram-clone/post"
    })

    const { caption } = req.body
    console.log(caption);

    const post = await PostModel.create({
        caption: caption,
        user: userId,
        postImage: file.url
    })

    res.status(201).json({
        message: "Post created successfully",
        post
    })
}



async function getPostOfUser(req, res) {

    const userId = req.user.id

    const post = await PostModel.find({ user: userId })

    if (!post.length) {
        return res.status(404).json({
            message: "Post not found"
        })
    }

    res.status(200).json({
        message: "Post fetched successfully",
        post
    })


}



async function getPostDetailsById(req, res) {
    const postId = req.params.postId

    if (!mongoose.isValidObjectId(postId)) {
        return res.status(400).json({ message: "Invalid post id" })
    }

    const post = await PostModel.findOne({ _id: postId })
        .populate({ path: "user", select: "username profileImage isPrivate" })
        .lean()

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        })
    }

    if (!await userCanViewPost(post, req.user)) {
        return res.status(403).json({
            message: "This account is private"
        })
    }

    res.status(200).json({
        message: "Post fetched successfully",
        post: (await decoratePosts([post], req.user))[0]
    })
}

async function deletePost(req, res) {
    const { postId } = req.params

    if (!mongoose.isValidObjectId(postId)) {
        return res.status(400).json({ message: "Invalid post id" })
    }

    const post = await PostModel.findById(postId)
    if (!post) {
        return res.status(404).json({ message: "Post not found" })
    }
    if (post.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "You can only delete your own posts" })
    }

    await Promise.all([
        PostModel.deleteOne({ _id: post._id }),
        LikeModel.deleteMany({ post: post._id }),
        SavedPostModel.deleteMany({ post: post._id }),
        CommentModel.deleteMany({ post: post._id }),
        ReshareModel.deleteMany({ post: post._id })
    ])

    return res.status(200).json({
        message: "Post deleted successfully",
        postId: post._id
    })
}

async function savePost(req, res) {
    const { postId } = req.params

    if (!mongoose.isValidObjectId(postId)) {
        return res.status(400).json({ message: "Invalid post id" })
    }

    const post = await PostModel.findById(postId)
        .populate({ path: "user", select: "username profileImage isPrivate" })
    if (!post) {
        return res.status(404).json({ message: "Post not found" })
    }
    if (!await userCanViewPost(post, req.user)) {
        return res.status(403).json({ message: "Follow this private account to save its posts" })
    }

    const savedPost = await SavedPostModel.findOneAndUpdate(
        { user: req.user.id, post: postId },
        { $setOnInsert: { user: req.user.id, post: postId } },
        { new: true, upsert: true }
    )

    return res.status(200).json({
        message: "Post saved successfully",
        savedPost
    })
}

async function unsavePost(req, res) {
    const { postId } = req.params

    if (!mongoose.isValidObjectId(postId)) {
        return res.status(400).json({ message: "Invalid post id" })
    }

    await SavedPostModel.deleteOne({ user: req.user.id, post: postId })
    return res.status(200).json({ message: "Post removed from saved posts" })
}

async function getSavedPosts(req, res) {
    const savedPosts = await SavedPostModel.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .populate({
            path: "post",
            populate: { path: "user", select: "username profileImage isPrivate" }
        })
        .lean()

    const posts = savedPosts.map(({ post }) => post).filter(Boolean)
    const viewablePosts = []
    for (const post of posts) {
        if (await userCanViewPost(post, req.user)) viewablePosts.push(post)
    }

    return res.status(200).json({
        message: "Saved posts fetched successfully",
        posts: await decoratePosts(viewablePosts, req.user)
    })
}

async function getProfileReshares(req, res) {
    const profile = await UserModel.findOne({ username: req.params.username })
        .select("_id username profileImage isPrivate")
        .lean()

    if (!profile) return res.status(404).json({ message: "User not found" })
    if (!await userCanViewPost({ user: profile }, req.user)) {
        return res.status(403).json({ message: "This account is private" })
    }

    const reshares = await ReshareModel.find({ user: profile._id })
        .sort({ createdAt: -1 })
        .limit(100)
        .populate({
            path: "post",
            populate: { path: "user", select: "username profileImage isPrivate" }
        })
        .lean()

    const entries = []
    for (const reshare of reshares) {
        if (reshare.post?.user && await userCanViewPost(reshare.post, req.user)) {
            entries.push({ post: reshare.post, resharedAt: reshare.createdAt })
        }
    }

    const posts = await decoratePosts(entries.map(({ post }) => post), req.user)
    return res.status(200).json({
        posts: posts.map((post, index) => ({
            ...post,
            profileReshareAt: entries[index].resharedAt
        }))
    })
}



async function likeByPostId(req, res) {
    const postId = req.params.postId
    const username = req.user.username

    const post = await PostModel.findById({ _id: postId })

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        })
    }
    const populatedPost = await post.populate({ path: "user", select: "username profileImage isPrivate" })
    if (!await userCanViewPost(populatedPost, req.user)) {
        return res.status(403).json({ message: "Follow this private account to interact with its posts" })
    }
    const isLike = await LikeModel.findOne({
        post: post._id,
        user: username
    })

    if (isLike) {
        return res.status(400).json({
            message: `Post already like by ${username}`
        })

    }

    const like = await LikeModel.create({
        post: post._id,
        user: username
    })

    await createNotification({
        recipient: post.user,
        actor: req.user.id,
        type: "like",
        post: post._id
    })

    res.status(201).json({
        message: "Post liked successfully",
        like
    })
}


async function disLikeByPostId(req, res) {
    const postId = req.params.postId
    const username = req.user.username

    const post = await PostModel.findById({ _id: postId })

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        })
    }
    const populatedPost = await post.populate({ path: "user", select: "username profileImage isPrivate" })
    if (!await userCanViewPost(populatedPost, req.user)) {
        return res.status(403).json({ message: "Follow this private account to interact with its posts" })
    }

    const dislike = await LikeModel.findOneAndDelete({
        post: post._id,
        user: username
    })

    if (!dislike) {
        return res.status(400).json({
            message: `Post already disliked by ${username}`
        })
    }

    return res.status(200).json({
        message: "Post disliked successfully",
        dislike
    })
}


async function getFeed(req, res) {

    const user = req.user
    const accepted = await FollowModel.find({ follower: user.username, status: "accepted" })
        .select("followee").lean()
    const visibleUsernames = [user.username, ...accepted.map(({ followee }) => followee)]
    const posts = await PostModel.find()
        .populate({
            path: "user",
            select: "username profileImage isPrivate",
            match: { $or: [{ isPrivate: { $ne: true } }, { username: { $in: visibleUsernames } }] }
        })
        .sort({ createdAt: -1, _id: -1 })
        .limit(30)
        .lean()
    const viewablePosts = posts.filter(post => post.user)

    res.status(200).json({
        message: "Posts fetch successfully",
        posts: await decoratePosts(viewablePosts, user)
    })
}

async function getExplorePosts(req, res) {
    const limit = 12
    const { cursor } = req.query
    if (cursor && !mongoose.isValidObjectId(cursor)) {
        return res.status(400).json({ message: "Invalid explore cursor" })
    }

    const query = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 80) : ""
    const userFilter = { isPrivate: { $ne: true } }
    let userIds
    if (query) {
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        const matchingUsers = await UserModel.find({
            isPrivate: { $ne: true },
            username: { $regex: escaped, $options: "i" }
        }).select("_id").lean()
        userIds = matchingUsers.map(({ _id }) => _id)
        userFilter._id = { $in: userIds }
    }
    const publicUsers = await UserModel.find(userFilter).select("_id").lean()
    const publicUserIds = publicUsers.map(({ _id }) => _id)
    const filter = { user: { $in: publicUserIds } }
    if (query) {
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        filter.$or = [
            { caption: { $regex: escaped, $options: "i" } },
            { user: { $in: userIds } }
        ]
    }
    if (cursor) filter._id = { $lt: new mongoose.Types.ObjectId(cursor) }
    const page = await PostModel.find(filter)
        .populate({ path: "user", select: "username profileImage isPrivate" })
        .sort({ _id: -1 })
        .limit(limit + 1)
        .lean()
    const visible = page.filter(post => post.user)
    const hasMore = visible.length > limit
    const posts = await decoratePosts(visible.slice(0, limit), req.user)

    return res.status(200).json({
        posts,
        nextCursor: hasMore ? posts.at(-1)?._id ?? null : null,
        hasMore
    })
}

async function getComments(req, res) {
    const { postId } = req.params
    const { cursor } = req.query
    if (!mongoose.isValidObjectId(postId) || (cursor && !mongoose.isValidObjectId(cursor))) {
        return res.status(400).json({ message: "Invalid post or comment cursor" })
    }
    const post = await PostModel.findById(postId)
        .populate({ path: "user", select: "username profileImage isPrivate" })
        .lean()
    if (!post) return res.status(404).json({ message: "Post not found" })
    if (!await userCanViewPost(post, req.user)) {
        return res.status(403).json({ message: "This account is private" })
    }

    const query = { post: post._id }
    if (cursor) query._id = { $lt: new mongoose.Types.ObjectId(cursor) }
    const comments = await CommentModel.find(query)
        .populate({ path: "user", select: "username profileImage" })
        .sort({ _id: -1 })
        .limit(21)
        .lean()
    const hasMore = comments.length > 20
    const items = comments.slice(0, 20)
    return res.status(200).json({
        comments: items.reverse(),
        nextCursor: hasMore ? items[0]?._id ?? null : null,
        hasMore
    })
}

async function createComment(req, res) {
    const { postId } = req.params
    const text = typeof req.body?.text === "string" ? req.body.text.trim() : ""
    if (!mongoose.isValidObjectId(postId)) return res.status(400).json({ message: "Invalid post id" })
    if (!text || text.length > 1000) return res.status(400).json({ message: "Comment must be 1 to 1000 characters" })

    const post = await PostModel.findById(postId)
        .populate({ path: "user", select: "username profileImage isPrivate" })
        .lean()
    if (!post) return res.status(404).json({ message: "Post not found" })
    if (!await userCanViewPost(post, req.user)) {
        return res.status(403).json({ message: "Follow this private account to comment" })
    }

    const comment = await CommentModel.create({ post: post._id, user: req.user.id, text })
    await comment.populate({ path: "user", select: "username profileImage" })
    await createNotification({
        recipient: post.user._id,
        actor: req.user.id,
        type: "comment",
        post: post._id,
        message: text.slice(0, 120)
    })
    return res.status(201).json({ comment })
}

async function deleteComment(req, res) {
    const { commentId } = req.params
    if (!mongoose.isValidObjectId(commentId)) return res.status(400).json({ message: "Invalid comment id" })
    const comment = await CommentModel.findById(commentId)
    if (!comment) return res.status(404).json({ message: "Comment not found" })
    if (comment.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "You can only delete your own comments" })
    }
    await comment.deleteOne()
    return res.status(200).json({ message: "Comment deleted", commentId })
}

async function toggleReshare(req, res) {
    const { postId } = req.params
    if (!mongoose.isValidObjectId(postId)) return res.status(400).json({ message: "Invalid post id" })
    const post = await PostModel.findById(postId)
        .populate({ path: "user", select: "username profileImage isPrivate" })
        .lean()
    if (!post) return res.status(404).json({ message: "Post not found" })
    if (!await userCanViewPost(post, req.user)) {
        return res.status(403).json({ message: "Follow this private account to reshare its posts" })
    }

    const existing = await ReshareModel.findOne({ post: post._id, user: req.user.id })
    if (existing) {
        await existing.deleteOne()
        return res.status(200).json({ isReshared: false })
    }

    try {
        await ReshareModel.create({ post: post._id, user: req.user.id })
        await createNotification({
            recipient: post.user._id,
            actor: req.user.id,
            type: "reshare",
            post: post._id
        })
    } catch (error) {
        if (error.code !== 11000) throw error
    }
    return res.status(201).json({ isReshared: true })
}

const postController = {
    createPost,
    getPostOfUser,
    getPostDetailsById,
    deletePost,
    likeByPostId,
    disLikeByPostId,
    getFeed,
    getExplorePosts,
    getComments,
    createComment,
    deleteComment,
    toggleReshare,
    savePost,
    unsavePost,
    getSavedPosts,
    getProfileReshares
}

export default postController;