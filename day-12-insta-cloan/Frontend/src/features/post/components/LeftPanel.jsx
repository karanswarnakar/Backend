import { Link } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth.js";
import "../style/panel.scss";

const LeftPanel = () => {
    const { user } = useAuth();

    return (
        <aside className="left-pannel pannel">
            <div className="container">
                <nav aria-label="Primary navigation">
                    <ul>
                        <li>
                            <Link to="/">
                                <span>Home</span>
                                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 21H5C4.45 21 4 20.55 4 20V11L1 11L11.33 1.61a1 1 0 0 1 1.34 0L23 11l-3 0v9c0 .55-.45 1-1 1ZM6 19h12V9.16l-6-5.46-6 5.46V19Z" /></svg>
                            </Link>
                        </li>
                        <li>
                            <Link to="/explore">
                                <span>Explore</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
                            </Link>
                        </li>
                        {user && (
                            <>
                                <li>
                                    <Link to="/network">
                                        <span>Network</span>
                                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 22a8 8 0 0 1 16 0H2Zm8-9a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm7.36 2.23A8 8 0 0 1 23 22h-3a10 10 0 0 0-2.64-6.77ZM16.98 3.1A5 5 0 0 1 16 13a7.97 7.97 0 0 0 1-6 7.96 7.96 0 0 0-.02-3.9Z" /></svg>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/messages">
                                        <span>Messages</span>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" /></svg>
                                    </Link>
                                </li>
                            </>
                        )}
                        {user && (
                            <li>
                                <Link to="/saved">
                                    <span>Bookmarks</span>
                                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 2h14a1 1 0 0 1 1 1v19.14a.5.5 0 0 1-.77.42L12 18.03l-7.23 4.53a.5.5 0 0 1-.77-.42V3a1 1 0 0 1 1-1Zm13 2H6v15.43l6-3.76 6 3.76V4Z" /></svg>
                                </Link>
                            </li>
                        )}
                        {user && (
                            <li>
                                <Link to="/settings">
                                    <span>Settings</span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.5.9L16 20.5h-2.8l-.3-1.8a8 8 0 0 1-1.7-.6l-1.5.9-2-2 1-1.5a8 8 0 0 1-.5-1.7l-1.8-.4v-2.8l1.8-.4a8 8 0 0 1 .6-1.6l-.9-1.5 2-2 1.5.9a8 8 0 0 1 1.7-.5l.4-1.8h2.8l.4 1.8a8 8 0 0 1 1.6.6l1.5-.9 2 2-.9 1.5a8 8 0 0 1 .5 1.7l1.8.4v2.8l-1.8.4a8 8 0 0 1-.6 1.6Z" /></svg>
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>

                <Link className="button btn-primary left-pannel__create" to="/create-post">
                    Create Post
                </Link>
                <div className="left-pannel__legal">
                    <Link to="/privacy">Privacy</Link>
                    <Link to="/cookies">Cookies</Link>
                </div>
            </div>
        </aside>
    );
};

export default LeftPanel;
