import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../auth/hooks/useAuth.js";
import { timeAgo } from "../../shared/timeAgo.js";
import {
    createPostComment,
    deletePostComment,
    getPostComments,
    getPublicPost,
    like,
    dislike,
    savePost,
    unsavePost,
    togglePostReshare
} from "../services/post.api.js";
import "../style/feed.scss";

const PostDetails = () => {
    const { postId } = useParams();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentsError, setCommentsError] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const commentsRef = useRef(null);

    useEffect(() => {
        let active = true;
        setPost(null);
        setComments([]);
        setLoading(true);
        setCommentsLoading(true);
        setError("");
        setCommentsError("");

        getPublicPost(postId)
            .then(postData => {
                if (active) setPost(postData.post);
            })
            .catch(loadError => {
                console.error("Failed to load post:", loadError);
                if (active) setError(loadError.response?.data?.message || "This post could not be loaded.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        getPostComments(postId)
            .then(commentData => {
                if (active) setComments(commentData.comments || []);
            })
            .catch(loadError => {
                console.error("Failed to load comments:", loadError);
                if (active) setCommentsError(loadError.response?.data?.message || "Comments could not be loaded.");
            })
            .finally(() => {
                if (active) setCommentsLoading(false);
            });

        return () => { active = false; };
    }, [postId]);

    useEffect(() => {
        if (!post || window.location.hash !== "#comments") return;
        window.requestAnimationFrame(() => {
            commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
    }, [post]);

    const act = async action => {
        if (!user) return;
        setActionError("");
        try {
            await action();
        } catch (actionFailure) {
            console.error("Post interaction failed:", actionFailure);
            setActionError(actionFailure.response?.data?.message || "That action could not be completed.");
        }
    };

    const toggleLike = () => act(async () => {
        if (post.isLiked) {
            await dislike(post._id);
            setPost(current => ({ ...current, isLiked: false, likes: Math.max(0, current.likes - 1) }));
        } else {
            await like(post._id);
            setPost(current => ({ ...current, isLiked: true, likes: current.likes + 1 }));
        }
    });

    const toggleSave = () => act(async () => {
        if (post.isSaved) await unsavePost(post._id);
        else await savePost(post._id);
        setPost(current => ({ ...current, isSaved: !current.isSaved }));
    });

    const toggleReshare = () => act(async () => {
        const result = await togglePostReshare(post._id);
        setPost(current => ({
            ...current,
            isReshared: result.isReshared,
            reshareCount: Math.max(0, (current.reshareCount ?? 0) + (result.isReshared ? 1 : -1))
        }));
    });

    const submitComment = async event => {
        event.preventDefault();
        if (!user || sending || !text.trim()) return;
        setSending(true);
        setActionError("");
        try {
            const result = await createPostComment(post._id, text);
            setComments(current => [...current, result.comment]);
            setPost(current => ({ ...current, commentCount: (current.commentCount ?? 0) + 1 }));
            setText("");
        } catch (commentError) {
            console.error("Failed to add comment:", commentError);
            setActionError(commentError.response?.data?.message || "Your comment could not be posted.");
        } finally {
            setSending(false);
        }
    };

    const removeComment = async commentId => {
        try {
            await deletePostComment(commentId);
            setComments(current => current.filter(comment => comment._id !== commentId));
            setPost(current => ({ ...current, commentCount: Math.max(0, (current.commentCount ?? 0) - 1) }));
        } catch (deleteError) {
            console.error("Failed to delete comment:", deleteError);
            setActionError(deleteError.response?.data?.message || "Comment could not be deleted.");
        }
    };

    if (loading) {
        return <><Navbar /><main className="post-detail__state">Loading post…</main></>;
    }
    if (error || !post) {
        return (
            <>
                <Navbar />
                <main className="post-detail__state">
                    <h1>Post unavailable</h1>
                    <p>{error || "This post is no longer available."}</p>
                    <Link to="/explore">Explore public posts</Link>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="post-detail">
                <div className="post-detail__media">
                    <img src={post.postImage} alt={post.caption || `Post by ${post.user.username}`} />
                    <Link className="post-detail__image-link" to={`/profile/${encodeURIComponent(post.user.username)}`}>
                        @{post.user.username}
                    </Link>
                </div>
                <section className="post-detail__side">
                    <header className="post-detail__author">
                        <img src={post.user.profileImage || "https://ik.imagekit.io/a2vhcigch/default-dp.png"} alt="" />
                        <div>
                            <Link to={`/profile/${encodeURIComponent(post.user.username)}`}>{post.user.username}</Link>
                            <time dateTime={post.createdAt}>{timeAgo(post.createdAt)}</time>
                        </div>
                    </header>
                    <div className="post-detail__comments" id="comments" ref={commentsRef} aria-label="Comments">
                        <article className="post-detail__caption">
                            <img src={post.user.profileImage || "https://ik.imagekit.io/a2vhcigch/default-dp.png"} alt="" />
                            <div>
                                <p><Link to={`/profile/${encodeURIComponent(post.user.username)}`}>{post.user.username}</Link> {post.caption}</p>
                                <time dateTime={post.createdAt}>{timeAgo(post.createdAt)}</time>
                            </div>
                        </article>
                        {commentsLoading ? (
                            <div className="post-detail__comment-loading" role="status" aria-label="Loading comments">
                                {[0, 1, 2].map(item => (
                                    <div className="post-detail__comment-skeleton" key={item}>
                                        <span />
                                        <i />
                                    </div>
                                ))}
                            </div>
                        ) : commentsError ? (
                            <p className="post-detail__comments-error" role="alert">{commentsError}</p>
                        ) : (
                            <>
                                {comments.map((comment, index) => (
                                    <article
                                        className="post-detail__comment"
                                        key={comment._id}
                                        style={{ "--comment-index": index }}
                                    >
                                        <img src={comment.user?.profileImage || "https://ik.imagekit.io/a2vhcigch/default-dp.png"} alt="" />
                                        <div className="post-detail__comment-body">
                                            <p><Link to={`/profile/${encodeURIComponent(comment.user?.username || "")}`}>{comment.user?.username || "User"}</Link> {comment.text}</p>
                                            <time dateTime={comment.createdAt}>{timeAgo(comment.createdAt)}</time>
                                        </div>
                                        {user?.id === comment.user?._id && (
                                            <button className="post-detail__delete-comment" type="button" aria-label="Delete comment" onClick={() => removeComment(comment._id)}>×</button>
                                        )}
                                    </article>
                                ))}
                                {!comments.length && <p className="post-detail__empty">No comments yet. Start the conversation.</p>}
                            </>
                        )}
                    </div>
                    <div className="post-detail__footer">
                        <div className="post-detail__actions">
                            <button type="button" aria-label={post.isLiked ? "Unlike post" : "Like post"} disabled={!user} onClick={toggleLike}>
                                {post.isLiked ? "♥" : "♡"} <span>{post.likes ?? 0}</span>
                            </button>
                            <button type="button" aria-label="Reshare post" disabled={!user} onClick={toggleReshare}>
                                ↻ <span>{post.reshareCount ?? 0}</span>
                            </button>
                            <button type="button" aria-label={post.isSaved ? "Remove bookmark" : "Save post"} disabled={!user} onClick={toggleSave}>
                                {post.isSaved ? "▣" : "▢"}
                            </button>
                        </div>
                        {actionError && <p className="post-detail__error" role="alert">{actionError}</p>}
                        {user ? (
                            <form className="post-detail__form" onSubmit={submitComment}>
                                <img src={user.profileImage || "https://ik.imagekit.io/a2vhcigch/default-dp.png"} alt="" />
                                <input
                                    value={text}
                                    maxLength={1000}
                                    onChange={event => setText(event.target.value)}
                                    placeholder="Add a comment…"
                                    aria-label="Add a comment"
                                />
                                <button type="submit" disabled={sending || !text.trim()}>{sending ? "Posting" : "Post"}</button>
                            </form>
                        ) : (
                            <p className="post-detail__login">Log in to like, comment, reshare, or bookmark. <Link to="/login">Log in</Link></p>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export default PostDetails;
