import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Post from "../components/Post";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import PostSkeleton from "../components/PostSkeleton.jsx";
import { getSavedPosts } from "../services/post.api";
import { usePost } from "../hooks/usePost";
import "../style/feed.scss";

const SavedPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadFailed, setLoadFailed] = useState(false);

    const {
        hendelLike,
        hendeldisLike,
        handelDeletePost,
        handelToggleSave,
        handelToggleReshare
    } = usePost();

    useEffect(() => {
        let active = true;

        getSavedPosts()
            .then((data) => {
                if (active) {
                    setPosts(data.posts || []);
                }
            })
            .catch((error) => {
                console.error("Failed to load saved posts:", error);

                if (active) {
                    setLoadFailed(true);
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    const removeSavedPost = async (postId) => {
        const success = await handelToggleSave(postId, true);

        if (success) {
            setPosts((current) =>
                current.filter((post) => post._id !== postId)
            );
        }

        return success;
    };

    const deleteSavedPost = async (postId) => {
        const success = await handelDeletePost(postId);

        if (success) {
            setPosts((current) =>
                current.filter((post) => post._id !== postId)
            );
        }

        return success;
    };

    return (
        <>
            <Navbar />

            <main className="contener">
                <LeftPanel />

                <section className="feed-contener bookmark-contener">
                    <header className="bookmark-page__heading">
                        <h1>Bookmarks</h1>
                        <p>Posts you’ve saved for later.</p>
                    </header>

                    {loading ? (
                        <div className="posts bookmark-page__posts"><PostSkeleton /><PostSkeleton /></div>
                    ) : loadFailed ? (
                        <p>Could not load saved posts. Please try again.</p>
                    ) : (
                        <div className="posts bookmark-page__posts">
                            {posts.map((post) => (
                                <Post
                                    key={post._id}
                                    user={post.user}
                                    post={post}
                                    hendelLike={hendelLike}
                                    hendeldisLike={hendeldisLike}
                                    onDeletePost={deleteSavedPost}
                                    onToggleSave={removeSavedPost}
                                    onToggleReshare={handelToggleReshare}
                                />
                            ))}

                            {!posts.length && (
                                <p className="bookmark-page__empty">No bookmarks yet. Save a post with the bookmark icon to find it here.</p>
                            )}
                        </div>
                    )}
                </section>

                <RightPanel />
            </main>
        </>
    );
};

export default SavedPosts;