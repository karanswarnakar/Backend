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
        message: `messaged you: ${notification.message || ""}`
    };
    return `${actor} ${actions[notification.type] || "interacted with you"}.`;
}

const NotificationsPage = () => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
                <header><h1>Activity</h1><p>Likes, follows, comments, reshares, and messages.</p></header>
                {error && <p className="notifications-page__error" role="alert">{error}</p>}
                {loading ? <p className="notifications-page__empty">Loading activity…</p> : (
                    <ul>
                        {items.map(item => (
                            <li className={!item.readAt ? "is-unread" : ""} key={item._id}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (item.type === "message") navigate("/messages");
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
