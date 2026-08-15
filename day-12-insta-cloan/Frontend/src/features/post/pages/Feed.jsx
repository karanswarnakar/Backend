import React, { useEffect } from "react";
import "../style/feed.scss";

import Post from "../components/Post";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";

import { usePost } from "../hooks/usePost";
import { useNavigate } from "react-router";
import Navbar from "../../components/Navbar";
const Feed = () => {

    const {
        feed,
        loading,
        user,
        hendelFeed,
        hendelLike,
        hendeldisLike,
        hendelGetMe
    } = usePost();

    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {
            const user = await hendelGetMe();

            if (!user) {
                navigate("/login");
                return;
            }

            hendelFeed();
        };

        checkAuth();
    }, []);

    if (loading && feed.length === 0) {
        return (
            <main>
                <h1>Feed loading....</h1>
            </main>
        );
    }


    return (
        
        <>
        <Navbar/>
        <main className="contener">

            <LeftPanel />

            <div className="feed-contener">

                <div className="posts">

                    {feed.map(post => (
                        <Post
                            user={post.user}
                            post={post}
                            key={post._id}
                            hendelLike={hendelLike}
                            hendeldisLike={hendeldisLike}
                        />
                    ))}

                </div>

            </div>

            <RightPanel />

        </main>
        </>
    );
};

export default Feed;