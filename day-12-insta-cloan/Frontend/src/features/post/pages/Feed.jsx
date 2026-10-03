import { useEffect, useState } from "react";
import { Link } from "react-router";
import "../style/feed.scss";

import Post from "../components/Post";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import PostSkeleton from "../components/PostSkeleton.jsx";

import { usePost } from "../hooks/usePost";
import Navbar from "../../components/Navbar";

const Feed = () => {
    const [loadFailed, setLoadFailed] = useState(false);
    const {
        feed,
        loading,
        hendelFeed,
        hendelLike,
        hendeldisLike,
        handelDeletePost,
        handelToggleSave,
        handelToggleReshare,
    } = usePost();
    useEffect(() => {
        let active = true;
        hendelFeed().then(success => {
            if (active && !success) setLoadFailed(true);
        });
        return () => { active = false; };
    }, [hendelFeed]);

    return (
        <>
            <Navbar />

            <main className="contener">

                <LeftPanel />

                <section className="feed-contener">
                    <div className="posts">
                        {loading && feed.length === 0 && <><PostSkeleton /><PostSkeleton /></>}
                        {loadFailed && <div className="feed-state" role="alert">
                            <p>Your feed could not be loaded.</p>
                            <button type="button" onClick={() => {
                                setLoadFailed(false);
                                hendelFeed().then(success => setLoadFailed(!success));
                            }}>Try again</button>
                        </div>}
                        {feed.map((post) => (
                            <Post
                                key={post._id}
                                user={post.user}
                                post={post}
                                hendelLike={hendelLike}
                                hendeldisLike={hendeldisLike}
                                onDeletePost={handelDeletePost}
                                onToggleSave={handelToggleSave}
                                onToggleReshare={handelToggleReshare}
                            />
                        ))}
                        {!loading && !loadFailed && !feed.length && (
                            <div className="feed-empty">
                                <h1>Your feed starts here</h1>
                                <p>Follow people to see what they share, or explore the latest public posts.</p>
                                <Link to="/explore">Explore posts</Link>
                                <Link to="/network">Find people to follow</Link>
                            </div>
                        )}
                    </div>
                </section>

                <RightPanel />

            </main>
        </>
    );
};

export default Feed;