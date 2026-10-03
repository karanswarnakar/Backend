import {
    getFeed,
    like,
    dislike,
    createPost,
    deletePost,
    savePost,
    unsavePost,
    togglePostReshare
} from "../services/post.api";

import { PostContext } from "../post.context";
import { useCallback, useContext } from "react";
import { ProfileContext } from "../../profile/profile.context.jsx";

export const usePost = () => {

    const context = useContext(PostContext);
    const { setProfile } = useContext(ProfileContext);

    const {
        feed,
        setFeed,
        loading,
        setLoading
    } = context;

    const updateProfilePosts = (updatePosts) => {
        setProfile(current => current
            ? { ...current, posts: updatePosts(current.posts ?? []) }
            : current
        );
    };

    const hendelFeed = useCallback(async (cursor = null) => {
        setLoading(true);

        try {
            const res = await getFeed(cursor);
            setFeed(current => {
                if (!cursor) return res.posts;
                const existingIds = new Set(current.map(post => post._id));
                return [...current, ...res.posts.filter(post => !existingIds.has(post._id))];
            });
            return res;
        } catch (error) {
            console.error("Failed to load feed:", error);
            return null;
        } finally {
            setLoading(false);
        }
    }, [setFeed, setLoading]);


    async function hendelLike(postId) {
        try {
            await like(postId);

            setFeed(prevFeed =>
                prevFeed.map(post =>
                    post._id === postId
                        ? {
                            ...post,
                            isLiked: true,
                            likes: (post.likes ?? 0) + 1
                        }
                        : post
                )
            );
            updateProfilePosts(posts => posts.map(post =>
                post._id === postId
                    ? { ...post, isLiked: true, likes: (post.likes ?? 0) + 1 }
                    : post
            ));
        } catch (error) {
            console.log(error);
        }
    }


    async function hendeldisLike(postId) {
        try {
            await dislike(postId);

            setFeed(prevFeed =>
                prevFeed.map(post =>
                    post._id === postId
                        ? {
                            ...post,
                            isLiked: false,
                            likes: Math.max(0, (post.likes ?? 0) - 1)
                        }
                        : post
                )
            );
            updateProfilePosts(posts => posts.map(post =>
                post._id === postId
                    ? { ...post, isLiked: false, likes: Math.max(0, (post.likes ?? 0) - 1) }
                    : post
            ));
        } catch (error) {
            console.log(error);
        }
    }

    async function handelDeletePost(postId) {
        try {
            await deletePost(postId);
            setFeed(posts => posts.filter(post => post._id !== postId));
            updateProfilePosts(posts => posts.filter(post => post._id !== postId));
            return true;
        } catch (error) {
            console.error("Failed to delete post:", error);
            return false;
        }
    }

    async function handelToggleSave(postId, isSaved) {
        try {
            if (isSaved) {
                await unsavePost(postId);
            } else {
                await savePost(postId);
            }
            const nextIsSaved = !isSaved;
            setFeed(posts => posts.map(post =>
                post._id === postId ? { ...post, isSaved: nextIsSaved } : post
            ));
            updateProfilePosts(posts => posts.map(post =>
                post._id === postId ? { ...post, isSaved: nextIsSaved } : post
            ));
            return true;
        } catch (error) {
            console.error("Failed to update saved post:", error);
            return false;
        }
    }

    async function handelToggleReshare(postId) {
        try {
            const result = await togglePostReshare(postId);
            const update = post => post._id === postId
                ? {
                    ...post,
                    isReshared: result.isReshared,
                    reshareCount: Math.max(0, (post.reshareCount ?? 0) + (result.isReshared ? 1 : -1))
                }
                : post;
            setFeed(posts => posts.map(update));
            updateProfilePosts(posts => posts.map(update));
            return result.isReshared;
        } catch (error) {
            console.error("Failed to reshare post:", error);
            return false;
        }
    }


    async function handelCreatePost(file, caption) {
        setLoading(true);

        try {
            const data = await createPost(file, caption);

            setFeed(prevFeed => [
                data.post,
                ...prevFeed

            ]);
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return {
        feed,
        loading,
        hendelFeed,
        hendelLike,
        hendeldisLike,
        handelDeletePost,
        handelToggleSave,
        handelToggleReshare,
        handelCreatePost
    };
};