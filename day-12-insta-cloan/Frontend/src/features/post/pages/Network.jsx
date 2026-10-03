import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../auth/hooks/useAuth.js";
import {
    acceptFollowerRequest,
    followUser,
    getDailyFollowSuggestions,
    getPendingFollowers,
    rejectFollowerRequest,
    unfollowUser,
    updateCachedFollowSuggestion
} from "../../profile/services/profile.api.js";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import "../style/feed.scss";

const Network = () => {
    const { user } = useAuth();
    const [suggestions, setSuggestions] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busyUsers, setBusyUsers] = useState([]);
    const [refreshesAt, setRefreshesAt] = useState("");

    const loadNetwork = useCallback(async (forceSuggestions = false) => {
        if (!user?.username) return;
        setLoading(true);
        setError("");

        try {
            const [suggestionData, requestData] = await Promise.all([
                getDailyFollowSuggestions(user.id, forceSuggestions),
                getPendingFollowers(user.username)
            ]);
            setSuggestions(suggestionData.suggestions || []);
            setRefreshesAt(suggestionData.refreshesAt || "");
            setRequests(requestData.pendingList || []);
        } catch (loadError) {
            console.error("Failed to load network:", loadError);
            setError("Your network could not be loaded. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [user?.id, user?.username]);

    useEffect(() => {
        loadNetwork();
    }, [loadNetwork]);

    useEffect(() => {
        if (!refreshesAt) return undefined;
        const delay = new Date(refreshesAt).getTime() - Date.now();
        if (delay <= 0) return undefined;
        const timeoutId = window.setTimeout(() => loadNetwork(true), delay);
        return () => window.clearTimeout(timeoutId);
    }, [loadNetwork, refreshesAt]);

    const updateFollow = async (profile) => {
        setBusyUsers(current => [...current, profile.username]);
        setError("");
        try {
            if (profile.followStatus === "pending" || profile.followStatus === "accepted") {
                await unfollowUser(profile.username);
                updateCachedFollowSuggestion(user.id, profile.username, null);
                setSuggestions(current => current.map(candidate =>
                    candidate.username === profile.username
                        ? { ...candidate, followStatus: null }
                        : candidate
                ));
            } else {
                const response = await followUser(profile.username);
                updateCachedFollowSuggestion(
                    user.id,
                    profile.username,
                    response.follow?.status || "pending"
                );
                setSuggestions(current => current.map(candidate =>
                    candidate.username === profile.username
                        ? { ...candidate, followStatus: response.follow?.status || "pending" }
                        : candidate
                ));
            }
        } catch (followError) {
            console.error(`Failed to update follow for @${profile.username}:`, followError);
            setError(`Could not update your follow for @${profile.username}.`);
        } finally {
            setBusyUsers(current => current.filter(username => username !== profile.username));
        }
    };

    const respondToRequest = async (username, accept) => {
        setBusyUsers(current => [...current, username]);
        setError("");
        try {
            if (accept) {
                await acceptFollowerRequest(username);
            } else {
                await rejectFollowerRequest(username);
            }
            setRequests(current => current.filter(request => request.follower !== username));
        } catch (requestError) {
            console.error(`Failed to respond to follow request from @${username}:`, requestError);
            setError(`Could not ${accept ? "accept" : "decline"} @${username}'s request.`);
        } finally {
            setBusyUsers(current => current.filter(item => item !== username));
        }
    };

    return (
        <>
            <Navbar />
            <main className="contener">
                <LeftPanel />
                <section className="feed-contener network-contener">
                    <div className="network-page">
                        <header className="network-page__header">
                            <h1>Your network</h1>
                            <p>Find people to follow and manage the requests you receive.</p>
                        </header>

                        {error && <p className="network-page__error" role="alert">{error}</p>}

                        <section className="network-page__section" aria-labelledby="network-requests-title">
                            <div className="network-page__section-heading">
                                <h2 id="network-requests-title">Follow requests</h2>
                                <span>{requests.length}</span>
                            </div>
                            {loading ? (
                                <div className="network-skeleton-list" role="status" aria-label="Loading follow requests">
                                    {[0, 1, 2].map(index => <div className="network-skeleton-row" key={index}><i /><span /><b /></div>)}
                                </div>
                            ) : requests.length ? (
                                <ul className="network-page__list">
                                    {requests.map(request => {
                                        const profile = request.followerProfile;
                                        return (
                                            <li key={request._id}>
                                                <Link
                                                    className="network-page__person"
                                                    to={`/profile/${encodeURIComponent(request.follower)}`}
                                                >
                                                    <img
                                                        src={profile?.profileImage || "https://ik.imagekit.io/a2vhcigch/default-dp.png"}
                                                        alt=""
                                                    />
                                                    <span>
                                                        <strong>{request.follower}</strong>
                                                        <small>@{request.follower}</small>
                                                    </span>
                                                </Link>
                                                <div className="network-page__actions">
                                                    <button
                                                        type="button"
                                                        className="button btn-primary"
                                                        disabled={busyUsers.includes(request.follower)}
                                                        onClick={() => respondToRequest(request.follower, true)}
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="button network-page__secondary"
                                                        disabled={busyUsers.includes(request.follower)}
                                                        onClick={() => respondToRequest(request.follower, false)}
                                                    >
                                                        Decline
                                                    </button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="network-page__empty">No pending follow requests.</p>
                            )}
                        </section>

                        <section className="network-page__section" aria-labelledby="network-suggestions-title">
                            <div className="network-page__section-heading">
                                <h2 id="network-suggestions-title">People to follow</h2>
                                <button
                                    type="button"
                                    className="network-page__refresh"
                                    onClick={() => loadNetwork(true)}
                                    disabled={loading}
                                >
                                    {loading ? "Refreshing..." : "Refresh"}
                                </button>
                            </div>
                            {loading ? (
                                <div className="network-skeleton-list" role="status" aria-label="Loading people to follow">
                                    {[0, 1, 2, 3].map(index => <div className="network-skeleton-row" key={index}><i /><span /><b /></div>)}
                                </div>
                            ) : suggestions.length ? (
                                <ul className="network-page__list">
                                    {suggestions.map(profile => (
                                        <li key={profile._id}>
                                            <Link
                                                className="network-page__person"
                                                to={`/profile/${encodeURIComponent(profile.username)}`}
                                            >
                                                <img
                                                    src={profile.profileImage || "https://ik.imagekit.io/a2vhcigch/default-dp.png"}
                                                    alt=""
                                                />
                                                <span>
                                                    <strong>{profile.username}</strong>
                                                    <small>
                                                        {profile.mutualCount
                                                            ? `${profile.mutualCount} mutual connection${profile.mutualCount === 1 ? "" : "s"}`
                                                            : profile.sharedInterestCount
                                                                ? `${profile.sharedInterestCount} shared interest${profile.sharedInterestCount === 1 ? "" : "s"}`
                                                                : `@${profile.username}`}
                                                    </small>
                                                </span>
                                            </Link>
                                            <button
                                                type="button"
                                                className={`button ${profile.followStatus ? "network-page__secondary" : "btn-primary"}`}
                                                disabled={busyUsers.includes(profile.username)}
                                                onClick={() => updateFollow(profile)}
                                            >
                                                {busyUsers.includes(profile.username)
                                                    ? "Working..."
                                                    : profile.followStatus === "accepted"
                                                        ? "Following"
                                                        : profile.followStatus === "pending"
                                                            ? "Requested"
                                                            : "Follow"}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="network-page__empty">No new suggestions today. Check back tomorrow.</p>
                            )}
                            <p className="network-page__note">Suggestions refresh daily and are ranked by mutual connections and shared interests.</p>
                        </section>
                    </div>
                </section>
                <RightPanel />
            </main>
        </>
    );
};

export default Network;
