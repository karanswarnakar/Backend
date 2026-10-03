import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth.js";
import { timeAgo } from "../../shared/timeAgo.js";

const Icon = ({ children }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        {children}
    </svg>
);

const Post = ({
    user,
    post,
    hendelLike,
    hendeldisLike,
    onDeletePost,
    onToggleSave,
    onToggleReshare,
    canInteract
}) => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [showHeart, setShowHeart] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [reshareLoading, setReshareLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState("");
    const menuRef = useRef(null);
    const lastTap = useRef(0);
    const singleTapTimer = useRef(null);
    const heartTimer = useRef(null);
    const isOwner = currentUser?.username === user?.username;
    const canAct = canInteract ?? Boolean(currentUser);

    useEffect(() => {
        const closeMenu = event => {
            if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
        };
        const closeOnEscape = event => {
            if (event.key === "Escape") {
                setMenuOpen(false);
                setConfirmDelete(false);
            }
        };
        document.addEventListener("mousedown", closeMenu);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("mousedown", closeMenu);
            document.removeEventListener("keydown", closeOnEscape);
            window.clearTimeout(singleTapTimer.current);
            window.clearTimeout(heartTimer.current);
        };
    }, []);

    const goToDetails = () => navigate(`/post/${post._id}`);

    const showLikeAnimation = () => {
        setShowHeart(true);
        window.clearTimeout(heartTimer.current);
        heartTimer.current = window.setTimeout(() => setShowHeart(false), 820);
    };

    const handleImageClick = () => {
        const now = Date.now();
        if (now - lastTap.current < 330) {
            lastTap.current = 0;
            window.clearTimeout(singleTapTimer.current);
            if (canAct) {
                if (!post.isLiked) hendelLike(post._id);
                showLikeAnimation();
            } else {
                goToDetails();
            }
            return;
        }
        lastTap.current = now;
        singleTapTimer.current = window.setTimeout(goToDetails, 330);
    };

    const sharePost = async () => {
        const url = `${window.location.origin}/post/${post._id}`;
        try {
            if (navigator.share) {
                await navigator.share({ title: `Post by @${user?.username}`, url });
            } else {
                await navigator.clipboard.writeText(url);
                setActionMessage("Link copied");
                window.setTimeout(() => setActionMessage(""), 1800);
            }
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Failed to share post:", error);
                setActionMessage("Could not share link");
                window.setTimeout(() => setActionMessage(""), 1800);
            }
        }
    };

    const comment = () => navigate(`/post/${post._id}#comments`);

    return (
        <article className="post">
            <div className="top">
                <Link to={`/profile/${encodeURIComponent(user?.username || "")}`} className="post__author">
                    <img
                        src={user?.profileImage || "https://ik.imagekit.io/a2vhcigch/default-dp.png"}
                        alt=""
                        className="userImage"
                    />
                    <span className="user-data">
                        <strong>{user?.username || "Unknown user"}</strong>
                        <span>@{user?.username || "unknown"} · {timeAgo(post.createdAt)}</span>
                    </span>
                </Link>
                <div className="post-menu" ref={menuRef}>
                    <button
                        type="button"
                        aria-label="Post options"
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen(open => !open)}
                    >
                        <Icon><circle cx="5" cy="12" r="1.4" fill="currentColor" /><circle cx="12" cy="12" r="1.4" fill="currentColor" /><circle cx="19" cy="12" r="1.4" fill="currentColor" /></Icon>
                    </button>
                    {menuOpen && (
                        <div className="post-menu__items" role="menu">
                            <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); goToDetails(); }}>
                                View post details
                            </button>
                            <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); sharePost(); }}>
                                Share post link
                            </button>
                            {isOwner && (
                                <button
                                    type="button"
                                    role="menuitem"
                                    className="post-menu__delete"
                                    onClick={() => { setMenuOpen(false); setConfirmDelete(true); }}
                                >
                                    Delete post
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <button
                type="button"
                className="post-image-wrap"
                aria-label={`Open post by ${user?.username}`}
                onClick={handleImageClick}
                onContextMenu={event => event.preventDefault()}
            >
                <img src={post.postImage} alt={post.caption || `Post by ${user?.username}`} className="post-image" />
                {showHeart && <span className="post-double-heart" aria-hidden="true">♥</span>}
            </button>

            <div className="icons">
                <div className="icon_set_1">
                    <div className={post.isLiked ? "liked" : "notLiked"}>
                        <button
                            type="button"
                            aria-label={post.isLiked ? "Unlike post" : "Like post"}
                            disabled={!canAct}
                            onClick={() => post.isLiked ? hendeldisLike(post._id) : hendelLike(post._id)}
                        >
                            <Icon>
                                <path
                                    d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
                                    fill={post.isLiked ? "currentColor" : "none"}
                                    stroke={post.isLiked ? "#ff4c66" : "currentColor"}
                                />
                            </Icon>
                        </button>
                        <span>{post.likes ?? 0}</span>
                    </div>
                    <div className="comment">
                        <button type="button" aria-label="View comments" onClick={comment}>
                            <Icon><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" /></Icon>
                        </button>
                        <span>{post.commentCount ?? 0}</span>
                    </div>
                    <div className={`reshare${post.isReshared ? " is-reshared" : ""}`}>
                        <button
                            type="button"
                            aria-label={post.isReshared ? "Undo reshare" : "Reshare post"}
                            disabled={!canAct || reshareLoading}
                            onClick={async () => {
                                if (!onToggleReshare || !canAct) return;
                                setReshareLoading(true);
                                try {
                                    await onToggleReshare(post._id);
                                } finally {
                                    setReshareLoading(false);
                                }
                            }}
                        >
                            <Icon><path d="M17 1l4 4-4 4V6H8a4 4 0 0 0-4 4v1H2v-1a6 6 0 0 1 6-6h9V1ZM7 23l-4-4 4-4v3h9a4 4 0 0 0 4-4v-1h2v1a6 6 0 0 1-6 6H7v3Z" /></Icon>
                        </button>
                        <span>{post.reshareCount ?? 0}</span>
                    </div>
                </div>
                <button
                    type="button"
                    className={`post__bookmark ${post.isSaved ? "post__bookmark--saved" : ""}`}
                    aria-label={post.isSaved ? "Remove bookmark" : "Save bookmark"}
                    aria-pressed={Boolean(post.isSaved)}
                    title={post.isSaved ? "Remove bookmark" : "Save to bookmarks"}
                    disabled={!canAct || saveLoading}
                    onClick={async () => {
                        if (!onToggleSave || !canAct || saveLoading) return;
                        setSaveLoading(true);
                        try {
                            await onToggleSave(post._id, Boolean(post.isSaved));
                        } finally {
                            setSaveLoading(false);
                        }
                    }}
                >
                    <Icon><path d="M5 3.5A1.5 1.5 0 0 1 6.5 2h11A1.5 1.5 0 0 1 19 3.5V22l-6.5-4L6 22V3.5Z" fill={post.isSaved ? "currentColor" : "none"} /></Icon>
                </button>
            </div>

            <p className="caption">
                <Link className="username" to={`/profile/${encodeURIComponent(user?.username || "")}`}>
                    @{user?.username || "unknown"}
                </Link>{" "}
                {post.caption}
            </p>
            {actionMessage && <span className="post__feedback" role="status">{actionMessage}</span>}

            {confirmDelete && (
                <div className="post-dialog-backdrop" onClick={() => setConfirmDelete(false)}>
                    <section
                        className="post-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={`delete-post-${post._id}`}
                        onClick={event => event.stopPropagation()}
                    >
                        <h2 id={`delete-post-${post._id}`}>Delete this post?</h2>
                        <p>This action cannot be undone.</p>
                        <div className="post-dialog__actions">
                            <button type="button" onClick={() => setConfirmDelete(false)}>Cancel</button>
                            <button
                                type="button"
                                className="post-menu__delete"
                                onClick={async () => {
                                    if (await onDeletePost(post._id)) setConfirmDelete(false);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </article>
    );
};

export default Post;
