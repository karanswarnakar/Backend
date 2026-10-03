import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import Navbar from "../components/Navbar";
import LeftPanel from "../post/components/LeftPanel.jsx";
import { useAuth } from "../auth/hooks/useAuth.js";
import { connectSocket, socket } from "../realtime/socket.js";
import { timeAgo } from "../shared/timeAgo.js";
import { getConversations, getMessages, openConversation, sendMessage } from "./messages.api.js";
import "./messages.scss";

const Messages = () => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [conversations, setConversations] = useState([]);
    const [activeId, setActiveId] = useState("");
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [typingUser, setTypingUser] = useState("");
    const [draft, setDraft] = useState("");
    const [conversationQuery, setConversationQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const typingTimer = useRef(null);
    const typingSent = useRef(false);
    const activeIdRef = useRef("");
    const messageListRef = useRef(null);
    const requestedUsername = searchParams.get("to");
    const activeConversation = conversations.find(item => item._id === activeId);
    const otherUser = activeConversation?.participants?.find(participant => participant._id !== user?.id);
    const filteredConversations = conversations.filter(conversation => {
        const person = conversation.participants?.find(participant => participant._id !== user?.id);
        return person?.username.toLowerCase().includes(conversationQuery.trim().toLowerCase());
    });

    const refreshConversations = useCallback(async () => {
        const result = await getConversations();
        setConversations(result.conversations || []);
    }, []);

    useEffect(() => {
        let active = true;
        async function initialize() {
            setLoading(true);
            setError("");
            try {
                const result = await getConversations();
                if (!active) return;
                setConversations(result.conversations || []);
                if (requestedUsername) {
                    const opened = await openConversation(requestedUsername);
                    if (!active) return;
                    setConversations(current => current.some(item => item._id === opened.conversation._id)
                        ? current
                        : [opened.conversation, ...current]);
                    setActiveId(opened.conversation._id);
                    setSearchParams({}, { replace: true });
                } else if (result.conversations?.length) {
                    setActiveId(result.conversations[0]._id);
                }
            } catch (loadError) {
                console.error("Failed to load messages:", loadError);
                if (active) setError(loadError.response?.data?.message || "Your messages could not be loaded.");
            } finally {
                if (active) setLoading(false);
            }
        }
        initialize();
        return () => { active = false; };
    }, [requestedUsername, setSearchParams]);

    useEffect(() => {
        if (!user) return undefined;
        connectSocket();
        const handlePresenceSnapshot = names => setOnlineUsers(new Set(names));
        const handlePresenceUpdate = ({ username, online }) => {
            setOnlineUsers(current => {
                const next = new Set(current);
                if (online) next.add(username);
                else next.delete(username);
                return next;
            });
        };
        socket.on("presence:snapshot", handlePresenceSnapshot);
        socket.on("presence:update", handlePresenceUpdate);
        socket.emit("presence:request");
        return () => {
            socket.off("presence:snapshot", handlePresenceSnapshot);
            socket.off("presence:update", handlePresenceUpdate);
        };
    }, [user]);

    useEffect(() => {
        activeIdRef.current = activeId;
        setTypingUser("");
        if (!activeId) {
            setMessages([]);
            return undefined;
        }
        let active = true;
        socket.emit("conversation:join", { conversationId: activeId });
        getMessages(activeId)
            .then(result => {
                if (active) setMessages(result.messages || []);
            })
            .catch(loadError => {
                console.error("Failed to load conversation messages:", loadError);
                if (active) setError(loadError.response?.data?.message || "Messages could not be loaded.");
            });
        return () => {
            active = false;
            if (typingSent.current) socket.emit("typing:update", { conversationId: activeId, isTyping: false });
            window.clearTimeout(typingTimer.current);
            typingSent.current = false;
        };
    }, [activeId]);

    useEffect(() => {
        const handleNewMessage = message => {
            const conversationId = message.conversation?._id || message.conversation;
            if (conversationId === activeIdRef.current) {
                setMessages(current => current.some(item => item._id === message._id) ? current : [...current, message]);
                setTypingUser("");
            }
            refreshConversations().catch(error => console.error("Failed to refresh conversation list:", error));
        };
        const handleIncomingMessage = ({ conversationId, message }) => {
            if (conversationId === activeIdRef.current) handleNewMessage(message);
            else refreshConversations().catch(error => console.error("Failed to refresh conversation list:", error));
        };
        const handleTyping = ({ conversationId, username, isTyping }) => {
            if (conversationId !== activeIdRef.current || username === user?.username) return;
            setTypingUser(isTyping ? username : "");
        };
        socket.on("message:new", handleNewMessage);
        socket.on("message:incoming", handleIncomingMessage);
        socket.on("typing:update", handleTyping);
        return () => {
            socket.off("message:new", handleNewMessage);
            socket.off("message:incoming", handleIncomingMessage);
            socket.off("typing:update", handleTyping);
        };
    }, [refreshConversations, user?.username]);

    useEffect(() => {
        if (messageListRef.current) messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }, [messages, typingUser]);

    const updateDraft = value => {
        setDraft(value);
        if (!activeId) return;
        if (!typingSent.current) {
            socket.emit("typing:update", { conversationId: activeId, isTyping: true });
            typingSent.current = true;
        }
        window.clearTimeout(typingTimer.current);
        typingTimer.current = window.setTimeout(() => {
            socket.emit("typing:update", { conversationId: activeId, isTyping: false });
            typingSent.current = false;
        }, 900);
    };

    const submitMessage = async event => {
        event.preventDefault();
        const text = draft.trim();
        if (!activeId || !text || sending) return;
        setSending(true);
        setError("");
        try {
            window.clearTimeout(typingTimer.current);
            if (typingSent.current) socket.emit("typing:update", { conversationId: activeId, isTyping: false });
            typingSent.current = false;
            const result = await sendMessage(activeId, text);
            setMessages(current => current.some(item => item._id === result.message._id)
                ? current
                : [...current, result.message]);
            setDraft("");
            await refreshConversations();
        } catch (sendError) {
            console.error("Failed to send message:", sendError);
            setError(sendError.response?.data?.message || "Message could not be sent.");
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="contener messages-layout">
                <LeftPanel />
                <section className="messages-page" aria-label="Messages">
                    <aside className="messages-inbox">
                        <header>
                            <div className="messages-inbox__heading">
                                <h1>Messages</h1>
                                <span>{conversations.length}</span>
                            </div>
                        </header>
                        <label className="messages-search">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                <circle cx="11" cy="11" r="7" />
                                <path d="m20 20-4-4" />
                            </svg>
                            <input
                                type="search"
                                value={conversationQuery}
                                onChange={event => setConversationQuery(event.target.value)}
                                placeholder="Search conversations"
                                aria-label="Search conversations"
                            />
                        </label>
                        {loading ? <p className="messages-empty">Loading conversations…</p> : filteredConversations.map(conversation => {
                        const person = conversation.participants?.find(participant => participant._id !== user?.id);
                        if (!person) return null;
                        const online = onlineUsers.has(person.username);
                        return (
                            <button
                                type="button"
                                className={`messages-conversation${activeId === conversation._id ? " is-active" : ""}`}
                                key={conversation._id}
                                onClick={() => setActiveId(conversation._id)}
                            >
                                <span className="messages-avatar">
                                    <img src={person.profileImage || "https://ik.imagekit.io/a2vhcigch/default-dp.png"} alt="" />
                                    {online && <i className="messages-online" title="Online" />}
                                </span>
                                <span className="messages-conversation__body">
                                    <strong>{person.username}</strong>
                                    <small>{conversation.lastMessage?.text || "Start a conversation"}</small>
                                </span>
                                {conversation.lastMessage?.createdAt && <time>{timeAgo(conversation.lastMessage.createdAt)}</time>}
                            </button>
                        );
                        })}
                        {!loading && !conversations.length && <p className="messages-empty">Visit a profile and choose Message to start a conversation.</p>}
                        {!loading && conversations.length > 0 && !filteredConversations.length && (
                            <p className="messages-empty">No conversations match “{conversationQuery}”.</p>
                        )}
                    </aside>

                    <section className="messages-chat">
                    {otherUser ? (
                        <>
                            <header className="messages-chat__header">
                                <span className="messages-avatar">
                                    <img src={otherUser.profileImage || "https://ik.imagekit.io/a2vhcigch/default-dp.png"} alt="" />
                                    {onlineUsers.has(otherUser.username) && <i className="messages-online" title="Online" />}
                                </span>
                                <div>
                                    <strong>{otherUser.username}</strong>
                                    <small>
                                        <i className={onlineUsers.has(otherUser.username) ? "is-online" : ""} />
                                        {onlineUsers.has(otherUser.username) ? "Active now" : "Offline"}
                                    </small>
                                </div>
                                <Link
                                    className="messages-chat__profile"
                                    to={`/profile/${encodeURIComponent(otherUser.username)}`}
                                >
                                    View profile
                                </Link>
                            </header>
                            <div className="messages-chat__list" ref={messageListRef}>
                                {messages.map(message => (
                                    <article
                                        key={message._id}
                                        className={`message-bubble${message.sender?._id === user?.id ? " is-mine" : ""}`}
                                    >
                                        <p>{message.text}</p>
                                        <time dateTime={message.createdAt}>{timeAgo(message.createdAt)}</time>
                                    </article>
                                ))}
                                {typingUser && (
                                    <div className="message-typing" aria-label={`${typingUser} is typing`}>
                                        <span /><span /><span />
                                    </div>
                                )}
                            </div>
                            {error && <p className="messages-error" role="alert">{error}</p>}
                            <form className="messages-compose" onSubmit={submitMessage}>
                                <input
                                    value={draft}
                                    maxLength={4000}
                                    onChange={event => updateDraft(event.target.value)}
                                    placeholder="Write a message…"
                                    aria-label="Write a message"
                                />
                                <button type="submit" disabled={!draft.trim() || sending}>
                                    {sending ? "Sending…" : "Send"}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                        <path d="m22 2-7 20-4-9-9-4Z" />
                                        <path d="M22 2 11 13" />
                                    </svg>
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="messages-welcome">
                            <span className="messages-welcome__icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
                                    <path d="M8 12h8M8 8h5" />
                                </svg>
                            </span>
                            <h2>Your messages</h2>
                            <p>Choose a conversation or open someone’s profile to start one.</p>
                            {error && <p className="messages-error" role="alert">{error}</p>}
                        </div>
                    )}
                    </section>
                </section>
            </main>
        </>
    );
};

export default Messages;
