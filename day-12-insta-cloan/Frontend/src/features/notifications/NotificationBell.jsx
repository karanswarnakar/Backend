import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../auth/hooks/useAuth.js";
import { connectSocket, socket } from "../realtime/socket.js";
import { getNotifications, markNotificationsRead } from "./notifications.api.js";
import { timeAgo } from "../shared/timeAgo.js";

const notificationText = notification => {
    const actor = notification.actor?.username || "Someone";
    const text = {
        follow: "started following you.",
        follow_request: "requested to follow you.",
        follow_accepted: "accepted your follow request.",
        like: "liked your post.",
        comment: `commented: “${notification.message || ""}”`,
        reshare: "reshared your post.",
        message: `sent you a message: “${notification.message || ""}”`
    }[notification.type] || "interacted with you.";
    return `${actor} ${text}`;
};

const NotificationBell = () => {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [unread, setUnread] = useState(0);
    const rootRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return undefined;
        let active = true;
        getNotifications()
            .then(data => {
                if (!active) return;
                setItems(data.notifications || []);
                setUnread(data.unreadCount || 0);
            })
            .catch(error => console.error("Failed to load notifications:", error));

        connectSocket();
        const handleNotification = notification => {
            setItems(current => [notification, ...current.filter(item => item._id !== notification._id)].slice(0, 20));
            setUnread(count => count + 1);
        };
        socket.on("notification:new", handleNotification);
        return () => {
            active = false;
            socket.off("notification:new", handleNotification);
        };
    }, [user]);

    useEffect(() => {
        const closeOnOutside = event => {
            if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
        };
        const closeOnEscape = event => {
            if (event.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", closeOnOutside);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("mousedown", closeOnOutside);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, []);

    const openNotifications = async () => {
        setOpen(value => !value);
        if (!unread) return;
        const unreadIds = items.filter(item => !item.readAt).map(item => item._id);
        try {
            await markNotificationsRead(unreadIds);
            setItems(current => current.map(item =>
                unreadIds.includes(item._id) ? { ...item, readAt: new Date().toISOString() } : item
            ));
            setUnread(count => Math.max(0, count - unreadIds.length));
        } catch (error) {
            console.error("Failed to mark notifications as read:", error);
        }
    };

    if (!user) return null;

    return (
        <div className="notification-bell" ref={rootRef}>
            <button
                type="button"
                className={`notification-bell__trigger${unread ? " has-unread" : ""}`}
                aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
                aria-expanded={open}
                onClick={openNotifications}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
                    <path d="M10 21h4" />
                </svg>
                {unread > 0 && <span className="notification-bell__count">{unread > 99 ? "99+" : unread}</span>}
            </button>
            {open && (
                <section className="notification-popover" aria-label="Notifications">
                    <header>
                        <h2>Notifications</h2>
                        <button type="button" onClick={() => navigate("/notifications")}>See all</button>
                    </header>
                    <ul>
                        {items.slice(0, 6).map(item => (
                            <li key={item._id} className={!item.readAt ? "is-unread" : ""}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpen(false);
                                        if (item.type === "message") navigate("/messages");
                                        else if (item.post?._id) navigate(`/post/${item.post._id}`);
                                        else if (item.actor?.username) navigate(`/profile/${encodeURIComponent(item.actor.username)}`);
                                    }}
                                >
                                    <img
                                        src={item.actor?.profileImage || "https://ik.imagekit.io/a2vhcigch/default-dp.png"}
                                        alt=""
                                    />
                                    <span>
                                        <strong>{notificationText(item)}</strong>
                                        <small>{timeAgo(item.createdAt)}</small>
                                    </span>
                                    {item.post?.postImage && <img className="notification-popover__thumbnail" src={item.post.postImage} alt="" />}
                                </button>
                            </li>
                        ))}
                        {!items.length && <li className="notification-popover__empty">Nothing new for now.</li>}
                    </ul>
                    <Link to="/notifications" onClick={() => setOpen(false)}>View all activity</Link>
                </section>
            )}
        </div>
    );
};

export default NotificationBell;
