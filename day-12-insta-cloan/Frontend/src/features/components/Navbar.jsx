import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import "./navbar.scss";
import { useAuth } from "../auth/hooks/useAuth.js";
import NotificationBell from "../notifications/NotificationBell.jsx";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [search, setSearch] = useState("");
    const menuRef = useRef(null);
    const { logoutHandle, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = event => {
            if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const submitSearch = event => {
        event.preventDefault();
        navigate(`/explore?q=${encodeURIComponent(search.trim())}`);
    };

    return (
        <header className="navbar">
            <div className="navbar__inner">
                <Link className="navbar__brand" to="/">
                    <span className="navbar__brand-name">Socially</span>
                </Link>

                <form className="navbar__search" onSubmit={submitSearch}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" />
                        <path d="M20 20l-4-4" />
                    </svg>
                    <input
                        type="search"
                        placeholder="Search people and posts"
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                        aria-label="Search people and posts"
                    />
                </form>

                <div className="navbar__actions">
                    {user && <NotificationBell />}
                    {!user && (
                        <Link className="navbar__create" to="/login">Log in</Link>
                    )}

                    {user ? (
                        <div className="navbar__profile-wrapper" ref={menuRef}>
                            <button
                                type="button"
                                className="navbar__profile"
                                aria-label="Open account menu"
                                aria-expanded={isMenuOpen}
                                onClick={() => setIsMenuOpen(previous => !previous)}
                            >
                                <img
                                    src={user.profileImage || "https://ik.imagekit.io/a2vhcigch/default-dp.png"}
                                    alt=""
                                />
                            </button>
                            {isMenuOpen && (
                                <div className="navbar__menu">
                                    <Link to={`/profile/${encodeURIComponent(user.username)}`} onClick={() => setIsMenuOpen(false)}>
                                        <span>👤</span> Profile
                                    </Link>
                                    <div className="navbar__menu-divider" />
                                    <button
                                        type="button"
                                        className="navbar__logout"
                                        onClick={async () => {
                                            await logoutHandle();
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        <span>↪</span> Log out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link className="navbar__signup" to="/register">Sign up</Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
