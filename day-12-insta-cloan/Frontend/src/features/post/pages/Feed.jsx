import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import "../style/feed.scss";

import Post from "../components/Post";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import PostSkeleton from "../components/PostSkeleton.jsx";

import { usePost } from "../hooks/usePost";
import Navbar from "../../components/Navbar";

const Feed = () => {
    const [loadError, setLoadError] = useState("");
    const [loadingPage, setLoadingPage] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const containerRef = useRef(null);
    const sentinelRef = useRef(null);
    const cursorRef = useRef(null);
    const hasMoreRef = useRef(true);
    const loadingRef = useRef(false);
    const requestIdRef = useRef(0);
    const {
        feed,
        loading,
        hendelFeed,
        hendelLike,
        hendeldisLike,
        handelDeletePost,
        handelToggleSave,
        handelToggleReshare,
    } = usePost();

    const loadPage = useCallback(async (reset = false) => {
        if (loadingRef.current || (!reset && !hasMoreRef.current)) return;
        if (reset) {
            requestIdRef.current += 1;
            cursorRef.current = null;
            hasMoreRef.current = true;
            setHasMore(true);
        }
        const requestId = requestIdRef.current;
        loadingRef.current = true;
        setLoadingPage(true);
        setLoadError("");
        try {
            const result = await hendelFeed(reset ? null : cursorRef.current);
            if (requestId !== requestIdRef.current) return;
            if (!result) {
                setLoadError("Your feed could not be loaded.");
                return;
            }
            cursorRef.current = result.nextCursor;
            hasMoreRef.current = result.hasMore;
            setHasMore(result.hasMore);
        } finally {
            if (requestId === requestIdRef.current) {
                loadingRef.current = false;
                setLoadingPage(false);
            }
        }
    }, [hendelFeed]);

    useEffect(() => {
        loadPage(true);
        return () => {
            requestIdRef.current += 1;
            loadingRef.current = false;
        };
    }, [loadPage]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        const root = containerRef.current;
        if (!sentinel || !root || !hasMore || loadingPage || loadError) return undefined;
        const observer = new IntersectionObserver(entries => {
            if (entries.some(entry => entry.isIntersecting)) loadPage();
        }, { root, rootMargin: "320px 0px" });
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, loadingPage, loadError, loadPage]);

    return (
        <>
            <Navbar />

            <main className="contener">

                <LeftPanel />

                <section
                    className="feed-contener"
                    ref={containerRef}
                    aria-label="Your feed"
                    aria-busy={loading || loadingPage}
                >
                    <div className="posts">
                        {(loading || loadingPage) && feed.length === 0 && (
                            <>
                                <PostSkeleton index={0} />
                                <PostSkeleton index={1} />
                            </>
                        )}
                        {loadError && <div className="feed-state" role="alert">
                            <p>{loadError}</p>
                            <button type="button" onClick={() => loadPage(feed.length === 0)}>Try again</button>
                        </div>}
                        {feed.map((post) => (
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
                        {!loading && !loadingPage && !loadError && !feed.length && (
                            <div className="feed-empty">
                                <h1>Your feed starts here</h1>
                                <p>Follow people to see what they share, or explore the latest public posts.</p>
                                <Link to="/explore">Explore posts</Link>
                                <Link to="/network">Find people to follow</Link>
                            </div>
                        )}
                        {loadingPage && feed.length > 0 && <PostSkeleton index={0} />}
                        {loadError && feed.length > 0 && <div className="feed-state" role="alert">
                            <p>{loadError}</p>
                            <button type="button" onClick={() => loadPage()}>Try again</button>
                        </div>}
                        {!hasMore && feed.length > 0 && <p className="feed-status">You’re all caught up.</p>}
                        <div className="feed-sentinel" ref={sentinelRef} aria-hidden="true" />
                    </div>
                </section>

                <RightPanel />

            </main>
        </>
    );
};

export default Feed;