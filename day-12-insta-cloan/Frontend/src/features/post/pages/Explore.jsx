import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../auth/hooks/useAuth.js";
import { getExplorePosts } from "../services/post.api.js";
import { usePost } from "../hooks/usePost.js";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import Post from "../components/Post";
import PostSkeleton from "../components/PostSkeleton.jsx";
import { searchProfiles } from "../../profile/services/profile.api.js";
import "../style/feed.scss";

const Explore = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [activeTab, setActiveTab] = useState("posts");
    const [profiles, setProfiles] = useState([]);
    const [profilesLoading, setProfilesLoading] = useState(false);
    const [profilesError, setProfilesError] = useState("");
    const { user } = useAuth();
    const { hendelLike, hendeldisLike, handelToggleSave, handelToggleReshare, handelDeletePost } = usePost();
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [retry, setRetry] = useState(0);
    const containerRef = useRef(null);
    const sentinelRef = useRef(null);
    const loadingRef = useRef(false);
    const cursorRef = useRef(null);
    const hasMoreRef = useRef(true);
    const requestIdRef = useRef(0);

    const loadPage = useCallback(async (reset = false) => {
        if (loadingRef.current || (!reset && !hasMoreRef.current)) return;
        if (reset) requestIdRef.current += 1;
        const requestId = requestIdRef.current;
        loadingRef.current = true;
        setLoading(true);
        setError("");
        try {
            const result = await getExplorePosts(reset ? null : cursorRef.current, query);
            if (requestId !== requestIdRef.current) return;
            setPosts(current => reset ? result.posts : [...current, ...result.posts]);
            cursorRef.current = result.nextCursor;
            hasMoreRef.current = result.hasMore;
            setHasMore(result.hasMore);
        } catch (loadError) {
            if (requestId !== requestIdRef.current) return;
            console.error("Failed to load Explore posts:", loadError);
            setError("Explore posts could not be loaded.");
        } finally {
            if (requestId === requestIdRef.current) {
                loadingRef.current = false;
                setLoading(false);
            }
        }
    }, [query]);

    useEffect(() => {
        setPosts([]);
        cursorRef.current = null;
        hasMoreRef.current = true;
        setHasMore(true);
        loadingRef.current = false;
        loadPage(true);
    }, [loadPage, retry]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        const root = containerRef.current;
        if (!sentinel || !root || activeTab !== "posts" || !hasMore || loading) return undefined;
        const observer = new IntersectionObserver(entries => {
            if (entries.some(entry => entry.isIntersecting)) loadPage();
        }, { root, rootMargin: "320px 0px" });
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [activeTab, hasMore, loading, loadPage]);

    useEffect(() => {
        if (activeTab !== "profiles") return undefined;
        if (!query.trim()) {
            setProfiles([]);
            setProfilesLoading(false);
            setProfilesError("");
            return undefined;
        }

        let active = true;
        setProfilesLoading(true);
        setProfilesError("");
        searchProfiles(query.trim())
            .then(result => {
                if (active) setProfiles(result.profiles || []);
            })
            .catch(searchError => {
                console.error("Failed to search profiles:", searchError);
                if (active) setProfilesError(searchError.response?.data?.message || "Profiles could not be searched.");
            })
            .finally(() => {
                if (active) setProfilesLoading(false);
            });
        return () => { active = false; };
    }, [activeTab, query]);

    const removePost = async postId => {
        const success = await handelDeletePost(postId);
        if (success) setPosts(current => current.filter(post => post._id !== postId));
        return success;
    };
    const updatePost = (postId, updater) => setPosts(current => current.map(post => post._id === postId ? updater(post) : post));

    return (
        <>
            <Navbar />
            <main className="contener">
                <LeftPanel />
                <section className="feed-contener explore-contener" ref={containerRef} aria-label="Explore posts">
                    <header className="explore-heading">
                        <div>
                            <h1>{query ? "Search results" : "Explore"}</h1>
                            <p>{query ? `Showing public posts and people for “${query}”` : "Discover recent posts from the community."}</p>
                        </div>
                    </header>
                    <div className="explore-tabs" role="tablist" aria-label="Search results">
                        <button id="explore-posts-tab" type="button" role="tab" aria-controls="explore-posts-panel" aria-selected={activeTab === "posts"} className={activeTab === "posts" ? "is-active" : ""} onClick={() => setActiveTab("posts")}>Posts</button>
                        <button id="explore-profiles-tab" type="button" role="tab" aria-controls="explore-profiles-panel" aria-selected={activeTab === "profiles"} className={activeTab === "profiles" ? "is-active" : ""} onClick={() => setActiveTab("profiles")}>Profiles</button>
                    </div>
                    {activeTab === "posts" && (
                        <div id="explore-posts-panel" className="posts" role="tabpanel" aria-labelledby="explore-posts-tab">
                            {loading && !posts.length && <><PostSkeleton /><PostSkeleton /></>}
                            {posts.map(post => (
                                <Post
                                    key={post._id}
                                    user={post.user}
                                    post={post}
                                    canInteract={Boolean(user)}
                                    hendelLike={hendelLike}
                                    hendeldisLike={hendeldisLike}
                                    onDeletePost={removePost}
                                    onToggleSave={handelToggleSave}
                                    onToggleReshare={handelToggleReshare}
                                    onPostUpdate={updatePost}
                                />
                            ))}
                            {!posts.length && !loading && !error && (
                                <p className="explore-empty">No public posts found yet.</p>
                            )}
                            {loading && posts.length > 0 && <PostSkeleton />}
                            {error && (
                                <div className="explore-error" role="alert">
                                    <p>{error}</p>
                                    <button type="button" onClick={() => setRetry(value => value + 1)}>Try again</button>
                                </div>
                            )}
                            {!hasMore && posts.length > 0 && <p className="explore-status">You’re all caught up.</p>}
                            <div className="explore-sentinel" ref={sentinelRef} aria-hidden="true" />
                        </div>
                    )}
                    {activeTab === "profiles" && (
                        <div id="explore-profiles-panel" className="explore-profiles" role="tabpanel" aria-labelledby="explore-profiles-tab">
                            {!query.trim() ? (
                                <p className="explore-empty">Search by username to discover profiles.</p>
                            ) : profilesLoading ? (
                                <div className="explore-profile-skeletons" role="status" aria-label="Loading profiles">
                                    {[0, 1, 2, 3].map(index => (
                                        <div className="explore-profile-skeleton" key={index}><i /><span><b /><b /></span></div>
                                    ))}
                                </div>
                            ) : profilesError ? (
                                <p className="explore-error" role="alert">{profilesError}</p>
                            ) : profiles.length ? profiles.map(profile => (
                                <Link className="explore-profile" key={profile._id} to={`/profile/${encodeURIComponent(profile.username)}`}>
                                    <img src={profile.profileImage || "https://ik.imagekit.io/a2vhcigch/default-dp.png"} alt="" />
                                    <span><strong>{profile.username}</strong><small>{profile.bio || `@${profile.username}`}</small></span>
                                    <span className="explore-profile__arrow" aria-hidden="true">→</span>
                                </Link>
                            )) : <p className="explore-empty">No profiles found for “{query}”.</p>}
                        </div>
                    )}
                    <footer className="explore-footer">
                        <Link to="/privacy">Privacy</Link>
                        <Link to="/cookies">Cookies</Link>
                    </footer>
                </section>
                <RightPanel />
            </main>
        </>
    );
};

export default Explore;
