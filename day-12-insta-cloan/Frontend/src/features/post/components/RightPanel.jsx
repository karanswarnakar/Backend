import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth.js";
import {
    followUser,
    getDailyFollowSuggestions,
    updateCachedFollowSuggestion,
    unfollowUser
} from "../../profile/services/profile.api.js";
import "../style/panel.scss";

const RightPanel = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busyUsername, setBusyUsername] = useState("");
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    const loadSuggestions = useCallback(async () => {
        if (!currentUser) {
            setLoading(false);
            return null;
        }
        setError("");
        try {
            const data = await getDailyFollowSuggestions(currentUser.id);
            setSuggestions(data.suggestions || []);
            return data.refreshesAt;
        } catch (loadError) {
            console.error("Failed to load follow suggestions:", loadError);
            setError("Suggestions could not be loaded.");
            return null;
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser) return undefined;
        const cacheKey = `socially:suggestions:${currentUser.id}`;
        let timeoutId;
        let active = true;
        const scheduleNextRefresh = refreshesAt => {
            const delay = Math.max(1000, new Date(refreshesAt).getTime() - Date.now());
            timeoutId = window.setTimeout(async () => {
                if (!active) return;
                const nextRefresh = await loadSuggestions();
                if (active && nextRefresh) scheduleNextRefresh(nextRefresh);
            }, delay);
        };
        try {
            const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
            if (cached?.refreshesAt && new Date(cached.refreshesAt).getTime() > Date.now()) {
                setSuggestions(cached.suggestions || []);
                setLoading(false);
                scheduleNextRefresh(cached.refreshesAt);
            } else {
                loadSuggestions().then(refreshAt => {
                    if (active && refreshAt) scheduleNextRefresh(refreshAt);
                });
            }
        } catch (cacheError) {
            console.error("Failed to read cached follow suggestions:", cacheError);
            loadSuggestions().then(refreshAt => {
                if (active && refreshAt) scheduleNextRefresh(refreshAt);
            });
        }
        return () => {
            active = false;
            window.clearTimeout(timeoutId);
        };
    }, [currentUser, loadSuggestions]);

    const handleFollow = async (username, followStatus) => {
        setBusyUsername(username);
        setError("");
        let nextStatus;
        try {
            if (followStatus === "pending" || followStatus === "accepted") {
                await unfollowUser(username);
                nextStatus = null;
                setSuggestions(current => current.map(user =>
                    user.username === username ? { ...user, followStatus: null } : user
                ));
            } else {
                const response = await followUser(username);
                nextStatus = response.follow?.status || "pending";
                setSuggestions(current => current.map(user =>
                    user.username === username
                        ? { ...user, followStatus: nextStatus }
                        : user
                ));
            }
            updateCachedFollowSuggestion(currentUser.id, username, nextStatus);
        } catch (followError) {
            console.error("Failed to update follow status:", followError);
            setError(`Could not update follow for @${username}.`);
        } finally {
            setBusyUsername("");
        }
    };

    if (!currentUser) return null;

    return (
        <aside className="right-pannel pannel">
            <div className="container">
                <Link
                    className="right-pannel__current-profile"
                    to={`/profile/${encodeURIComponent(currentUser.username)}`}
                >
                    <img
                        src={currentUser.profileImage || "https://ik.imagekit.io/a2vhcigch/default-dp.png"}
                        alt=""
                    />
                    <span className="user-data">
                        <strong>{currentUser.username}</strong>
                        <span>View your profile</span>
                    </span>
                    <span className="right-pannel__profile-arrow" aria-hidden="true">→</span>
                </Link>
                <div className="right-pannel__heading">
                    <div>
                        <h2>Suggested</h2>
                        <p>People you may know</p>
                    </div>
                </div>
                <hr className="hr" />

                {error && <p className="right-pannel__error" role="alert">{error}</p>}
                {loading ? (
                    <ul className="right-pannel__suggestion-skeletons" role="status" aria-label="Loading suggestions">
                        {[0, 1, 2].map(index => (
                            <li className="right-pannel__suggestion-skeleton" key={index}>
                                <i />
                                <span><b /><b /></span>
                                <em />
                            </li>
                        ))}
                    </ul>
                ) : suggestions.length ? (
                    <ul className="right-pannel__suggestions">
                        {suggestions.slice(0, 4).map(profile => (
                            <li key={profile._id}>
                                <div className="right-pannel__person">
                                    <button
                                        type="button"
                                        className="right-pannel__profile"
                                        onClick={() => navigate(`/profile/${encodeURIComponent(profile.username)}`)}
                                    >
                                        <img
                                            src={profile.profileImage || "https://ik.imagekit.io/a2vhcigch/default-dp.png"}
                                            alt=""
                                            className="userImage"
                                        />
                                        <span className="user-data">
                                            <strong>{profile.username}</strong>
                                            <span>
                                                {profile.mutualCount
                                                    ? `${profile.mutualCount} mutual connection${profile.mutualCount === 1 ? "" : "s"}`
                                                    : profile.sharedInterestCount
                                                        ? `${profile.sharedInterestCount} shared interest${profile.sharedInterestCount === 1 ? "" : "s"}`
                                                        : `@${profile.username}`}
                                            </span>
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        className={`button ${profile.followStatus ? "right-pannel__following" : "btn-primary"}`}
                                        disabled={busyUsername === profile.username}
                                        onClick={() => handleFollow(profile.username, profile.followStatus)}
                                    >
                                        {busyUsername === profile.username
                                            ? "..."
                                            : profile.followStatus === "accepted"
                                            ? "Following"
                                            : profile.followStatus === "pending"
                                                ? "Requested"
                                                : "Follow"}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="right-pannel__message">You’re all caught up. Check back tomorrow.</p>
                )}

                <Link className="right-pannel__more" to="/network">Open your network</Link>
            </div>
        </aside>
    );
};

export default RightPanel;
