import {
    getFeed,
    like,
    dislike,
    createPost,
    getMe
} from "../services/post.api";

import { PostContext } from "../post.context";
import { useContext } from "react";
import { useNavigate } from "react-router";

export const usePost = () => {
    const context = useContext(PostContext);
    const navigete = useNavigate()
    const {
        feed,
        setFeed,
        loading,
        setLoading,
        user,
        setUser
    } = context;

 async function hendelGetMe() {
    setLoading(true);

    try {
        const data = await getMe();

        if (!data) {
            setUser(null);
            return null;
        }

        setUser(data.user);
        return data.user;

    } catch (error) {
        console.log(error);
        return null;
    } finally {
        setLoading(false);
    }
}
    async function hendelFeed() {
        setLoading(true);

        try {
            const res = await getFeed();

            setFeed(res.posts.reverse());
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }


    async function hendelLike(postId) {
        try {
            await like(postId);

            setFeed(prevFeed =>
                prevFeed.map(post =>
                    post._id === postId
                        ? {
                            ...post,
                            isLiked: true,
                            likes: post.likes + 1
                        }
                        : post
                )
            );
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
                            likes: post.likes - 1
                        }
                        : post
                )
            );
        } catch (error) {
            console.log(error);
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
        user,

        hendelFeed,
        hendelLike,
        hendeldisLike,
        handelCreatePost,
        hendelGetMe
    };
};