import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { useAuth } from "../auth/hooks/useAuth.js";
import { timeAgo } from "../shared/timeAgo.js";
import { getNotifications, markNotificationsRead } from "./notifications.api.js";
import "./notifications.scss";

function describeNotification(notification) {
    const actor = notification.actor?.username || "Someone";
    const actions = {
        follow: "started following you",
        follow_request: "requested to follow you",
        follow_accepted: "accepted your follow request",
        like: "liked your post",
        comment: `commented: ${notification.message || ""}`,
        reshare: "reshared your post",
        message: `messaged you: ${notification.message || ""}`,
        privacy_update: `changed your account privacy to ${notification.message}`
    };
    return notification.type === "privacy_update"
        ? `You ${actions[notification.type]}.`
        : `${actor} ${actions[notification.type] || "interacted with you"}.`;
}

const NotificationsPage = () => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const goBack = () => {
        if (window.history.state?.idx > 0) {
            navigate(-1);
            return;
        }
        navigate(user ? "/" : "/explore");
    };

    useEffect(() => {
        let active = true;
        getNotifications()
            .then(async data => {
                if (!active) return;
                setItems(data.notifications || []);
                const unreadIds = data.notifications.filter(item => !item.readAt).map(item => item._id);
                if (unreadIds.length) {
                    await markNotificationsRead(unreadIds);
                    if (active) {
                        setItems(current => current.map(item =>
                            unreadIds.includes(item._id) ? { ...item, readAt: new Date().toISOString() } : item
                        ));
                    }
                }
            })
            .catch(loadError => {
                console.error("Failed to load notifications:", loadError);
                if (active) setError("Notifications could not be loaded.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => { active = false; };
    }, []);

    return (
        <>
            <Navbar />
            <main className="notifications-page">
                <button className="notifications-page__back" type="button" onClick={goBack}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    <span>Back</span>
                </button>
                <header><h1>Activity</h1><p>Likes, follows, comments, reshares, and messages.</p></header>
                {error && <p className="notifications-page__error" role="alert">{error}</p>}
                {loading ? (
                    <ul className="notifications-page__skeleton-list" role="status" aria-label="Loading activity">
                        {Array.from({ length: 6 }, (_, index) => (
                            <li className="notifications-page__skeleton-row" key={index} aria-hidden="true">
                                <span className="notifications-page__skeleton-avatar" />
                                <span className="notifications-page__skeleton-copy">
                                    <i />
                                    <i />
                                </span>
                                {index === 1 || index === 3
                                    ? <span className="notifications-page__skeleton-thumbnail" />
                                    : null}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <ul>
                        {items.map(item => (
                            <li className={!item.readAt ? "is-unread" : ""} key={item._id}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (item.type === "message") navigate("/messages");
                                        else if (item.type === "privacy_update") navigate("/settings");
                                        else if (item.post?._id) navigate(`/post/${item.post._id}`);
                                        else if (item.actor?.username) navigate(`/profile/${encodeURIComponent(item.actor.username)}`);
                                    }}
                                >
                                    <img src={item.actor?.profileImage || "https://ik.imagekit.io/a2vhcigch/default-dp.png"} alt="" />
                                    <span><strong>{describeNotification(item)}</strong><small>{timeAgo(item.createdAt)}</small></span>
                                    {item.post?.postImage && <img className="notifications-page__post" src={item.post.postImage} alt="" />}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                {!loading && !items.length && <p className="notifications-page__empty">No activity to show yet.</p>}
                <footer><Link to={user ? "/" : "/explore"}>Back to Socially</Link></footer>
            </main>
        </>
    );
};

export default NotificationsPage;
