import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import "../style/profile.scss";
import { useProfile } from "../hooks/useProfile";
import { useAuth } from "../../auth/hooks/useAuth.js";
import { getPendingFollowers } from "../services/profile.api.js";
import Post from "../../post/components/Post.jsx";
import { usePost } from "../../post/hooks/usePost.js";
import { getProfileReshares } from "../../post/services/post.api.js";
import "../../post/style/feed.scss";
import Navbar from "../../components/Navbar.jsx";

const Profile = () => {
    const {
        profile,
        lodding,
        handleGetProfileByUsername,
        handleToggleFollow,
        handleAcceptFollowerRequest,
        handleRejectFollowerRequest
    } = useProfile();

    const { user } = useAuth();
    const navigate = useNavigate();
    const { username: routeUsername } = useParams();
    const username = routeUsername ?? user?.username;

    const {
        hendelLike,
        hendeldisLike,
        handelDeletePost,
        handelToggleSave,
        handelToggleReshare
    } = usePost();

    const [followLoading, setFollowLoading] = useState(false);
    const [requestsOpen, setRequestsOpen] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [requestsLoading, setRequestsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("posts");
    const [resharedPosts, setResharedPosts] = useState([]);
    const [reshareLoading, setReshareLoading] = useState(false);
    const [reshareError, setReshareError] = useState("");
    const [loadedReshareUsername, setLoadedReshareUsername] = useState("");
    const [reshareRetry, setReshareRetry] = useState(0);

    useEffect(() => {
        if (username) {
            handleGetProfileByUsername({ username });
        }
    }, [username, handleGetProfileByUsername]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });
    }, [profile?.username]);

    useEffect(() => {
        setActiveTab("posts");
        setLoadedReshareUsername("");
        setResharedPosts([]);
        setReshareError("");
    }, [profile?.username]);

    useEffect(() => {
        if (activeTab !== "reshares" || !profile || profile.requiresFollow ||
            loadedReshareUsername === profile.username) return undefined;

        let active = true;
        setReshareLoading(true);
        setReshareError("");
        getProfileReshares(profile.username)
            .then(data => {
                if (!active) return;
                setResharedPosts(data.posts || []);
                setLoadedReshareUsername(profile.username);
            })
            .catch(error => {
                console.error("Failed to load profile reshares:", error);
                if (active) setReshareError(error.response?.data?.message || "Reshares could not be loaded.");
            })
            .finally(() => {
                if (active) setReshareLoading(false);
            });
        return () => { active = false; };
    }, [activeTab, loadedReshareUsername, profile, reshareRetry]);

    const isOwnProfile = user?.username === profile?.username;

    const toggleFollow = async () => {
        setFollowLoading(true);

        try {
            await handleToggleFollow(
                profile.username,
                profile.followStatus
            );
        } catch (error) {
            console.error("Failed to update follow status:", error);
        } finally {
            setFollowLoading(false);
        }
    };

    const openFollowRequests = async () => {
        setRequestsOpen(true);
        setRequestsLoading(true);

        try {
            const data = await getPendingFollowers(user.username);
            setPendingRequests(data.pendingList);
        } catch (error) {
            console.error("Failed to load follow requests:", error);
        } finally {
            setRequestsLoading(false);
        }
    };

    const handleFollowRequest = async (follower, accept) => {
        try {
            if (accept) {
                await handleAcceptFollowerRequest(follower);
            } else {
                await handleRejectFollowerRequest(follower);
            }

            setPendingRequests((current) =>
                current.filter(
                    (request) => request.follower !== follower
                )
            );

            await handleGetProfileByUsername({
                username: profile.username
            });
        } catch (error) {
            console.error(
                "Failed to respond to follow request:",
                error
            );
        }
    };

    if (lodding) {
        return (
            <>
                <Navbar />
                <div className="profile__state">
                    Loading profile…
                </div>
            </>
        );
    }

    if (!profile) {
        return (
            <>
                <Navbar />
                <div className="profile__state">
                    Profile not found.
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="profile">
                <div className="profile__header">
                    <div className="profile__top">
                        <div className="profile__avatar">
                            <img
                                src={profile.profileImage}
                                alt={profile.username}
                            />
                        </div>

                        <div className="profile__info">
                            <div className="profile__name">
                                <h2>{profile.username}</h2>

                                <span className="profile__verified">
                                    ✓
                                </span>
                            </div>

                            <p className="profile__username">
                                @{profile.username}
                            </p>

                            <div className="profile__actions">
                                {isOwnProfile ? (
                                    <button
                                        className="profile__edit"
                                        type="button"
                                        onClick={() =>
                                            navigate("/profile/edit")
                                        }
                                    >
                                        Edit Profile
                                    </button>
                                ) : user ? (
                                    <button
                                        className="profile__edit"
                                        type="button"
                                        disabled={followLoading}
                                        onClick={toggleFollow}
                                    >
                                        {followLoading
                                            ? "Please wait..."
                                            : profile.followStatus ===
                                                "accepted"
                                            ? "Following"
                                            : profile.followStatus ===
                                                "pending"
                                            ? "Requested"
                                            : "Follow"}
                                    </button>
                                ) : (
                                    <Link
                                        className="profile__edit"
                                        to="/login"
                                    >
                                        Log in to follow
                                    </Link>
                                )}

                                {isOwnProfile && (
                                    <>
                                        <button
                                            className="profile__edit"
                                            type="button"
                                            onClick={openFollowRequests}
                                        >
                                            Follow requests
                                        </button>

                                    </>
                                )}

                                {!isOwnProfile && user && (
                                    <button
                                        className="profile__edit"
                                        type="button"
                                        disabled={profile.requiresFollow}
                                        onClick={() =>
                                            navigate(
                                                `/messages?to=${encodeURIComponent(
                                                    profile.username
                                                )}`
                                            )
                                        }
                                    >
                                        {profile.requiresFollow
                                            ? "Follow to message"
                                            : "Message"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="profile__bio">
                        <p className="profile__joined">
                            Joined{" "}
                            {new Date(
                                profile.createdAt
                            ).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="profile__stats">
                        <div>
                            <strong>
                                {profile.posts?.length ?? 0}
                            </strong>
                            <span>Posts</span>
                        </div>

                        <div>
                            <strong>
                                {profile.followerCount ?? 0}
                            </strong>
                            <span>Followers</span>
                        </div>

                        <div>
                            <strong>
                                {profile.followingCount ?? 0}
                            </strong>
                            <span>Following</span>
                        </div>
                    </div>
                </div>

                <div className="profile__tabs">
                    <button
                        className={`profile__tab${activeTab === "posts" ? " active" : ""}`}
                        type="button"
                        aria-pressed={activeTab === "posts"}
                        onClick={() => setActiveTab("posts")}
                    >
                        Posts
                    </button>
                    <button
                        className={`profile__tab${activeTab === "reshares" ? " active" : ""}`}
                        type="button"
                        aria-pressed={activeTab === "reshares"}
                        onClick={() => setActiveTab("reshares")}
                    >
                        Reshares
                    </button>
                </div>

                <div className="profile__posts">
                    {profile.requiresFollow ? (
                        <div className="profile__private">
                            <h2>This account is private</h2>

                            <p>
                                Follow this account to see its posts
                                and connect with {profile.username}.
                            </p>
                        </div>
                    ) : activeTab === "posts" ? (
                        <>
                            {profile.posts?.map((post) => (
                                <Post
                                    key={post._id}
                                    user={post.user}
                                    post={post}
                                    hendelLike={hendelLike}
                                    hendeldisLike={hendeldisLike}
                                    onDeletePost={handelDeletePost}
                                    onToggleSave={handelToggleSave}
                                    onToggleReshare={handelToggleReshare}
                                />
                            ))}
                        </>
                    ) : reshareLoading ? (
                        <p className="profile__tab-state" role="status">Loading reshares…</p>
                    ) : reshareError ? (
                        <div className="profile__tab-state" role="alert">
                            <p>{reshareError}</p>
                            <button type="button" onClick={() => setReshareRetry(retry => retry + 1)}>Try again</button>
                        </div>
                    ) : (
                        resharedPosts.map(post => (
                            <Post
                                key={`${post._id}-${post.profileReshareAt}`}
                                user={post.user}
                                post={post}
                                hendelLike={hendelLike}
                                hendeldisLike={hendeldisLike}
                                onDeletePost={handelDeletePost}
                                onToggleSave={handelToggleSave}
                                onToggleReshare={handelToggleReshare}
                            />
                        ))
                    )}

                    {!profile.requiresFollow && activeTab === "posts" && !profile.posts?.length && (
                        <p className="profile__tab-state">No posts yet.</p>
                    )}
                    {!profile.requiresFollow && activeTab === "reshares" && !reshareLoading && !reshareError && !resharedPosts.length && (
                        <p className="profile__tab-state">No reshares yet.</p>
                    )}
                </div>

                {requestsOpen && (
                    <div
                        className="post-dialog-backdrop"
                        onClick={() => setRequestsOpen(false)}
                    >
                        <section
                            className="post-dialog follow-requests-dialog"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="follow-requests-title"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >
                            <h2 id="follow-requests-title">
                                Follow requests
                            </h2>

                            {requestsLoading ? (
                                <p>Loading requests...</p>
                            ) : (
                                <>
                                    {pendingRequests.map(
                                        (request) => (
                                            <div
                                                className="follow-request"
                                                key={request._id}
                                            >
                                                <span>
                                                    @{request.follower}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleFollowRequest(
                                                            request.follower,
                                                            true
                                                        )
                                                    }
                                                >
                                                    Accept
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleFollowRequest(
                                                            request.follower,
                                                            false
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )
                                    )}

                                    {!pendingRequests.length && (
                                        <p>
                                            No pending requests.
                                        </p>
                                    )}
                                </>
                            )}

                            <div className="post-dialog__actions">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setRequestsOpen(false)
                                    }
                                >
                                    Close
                                </button>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </>
    );
};

export default Profile;