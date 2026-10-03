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
                                {!comments.length && (
                                    <div className="post-detail__empty">
                                        <span aria-hidden="true">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                                <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
                                                <path d="M8 12h8M8 8h5" />
                                            </svg>
                                        </span>
                                        <strong>No comments yet</strong>
                                        <p>Be the first to share what you think.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="post-detail__footer">
                        <div className="post-detail__actions">
                            <button
                                type="button"
                                className={post.isLiked ? "is-liked" : ""}
                                aria-label={post.isLiked ? "Unlike post" : "Like post"}
                                aria-pressed={Boolean(post.isLiked)}
                                disabled={!user}
                                onClick={toggleLike}
                            >
                                <svg viewBox="0 0 24 24" fill={post.isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                                </svg>
                                <span>{post.likes ?? 0}</span>
                            </button>
                            <button
                                type="button"
                                className={post.isReshared ? "is-reshared" : ""}
                                aria-label={post.isReshared ? "Undo reshare" : "Reshare post"}
                                aria-pressed={Boolean(post.isReshared)}
                                disabled={!user}
                                onClick={toggleReshare}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="m17 1 4 4-4 4V6H8a4 4 0 0 0-4 4v1H2v-1a6 6 0 0 1 6-6h9V1ZM7 23l-4-4 4-4v3h9a4 4 0 0 0 4-4v-1h2v1a6 6 0 0 1-6 6H7v3Z" />
                                </svg>
                                <span>{post.reshareCount ?? 0}</span>
                            </button>
                            <button
                                type="button"
                                className={`post-detail__save${post.isSaved ? " is-saved" : ""}`}
                                aria-label={post.isSaved ? "Remove bookmark" : "Save post"}
                                aria-pressed={Boolean(post.isSaved)}
                                disabled={!user}
                                onClick={toggleSave}
                            >
                                <svg viewBox="0 0 24 24" fill={post.isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h9A1.5 1.5 0 0 1 18 3.5V22l-6-4-6 4V3.5Z" />
                                </svg>
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
