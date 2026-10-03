import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import "./navbar.scss";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    return (
        <header className="navbar">
            <div className="navbar__inner">

                {/* Brand */}
                <div className="navbar__brand">
                    <span className="navbar__brand-name">
                        Socially
                    </span>
                </div>

                {/* Search */}
                <div className="navbar__search">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="11" cy="11" r="7" />
                        <path d="M20 20l-4-4" />
                    </svg>

                    <input
                        type="text"
                        placeholder="Search"
                    />
                </div>

                {/* Actions */}
                <div className="navbar__actions">

                    {/* Create */}
                    <Link
                        className="navbar__create"
                        to="/create-post"
                    >
                        <span>+</span>
                        <span className="navbar__create-text">
                            Create
                        </span>
                    </Link>

                    {/* Profile */}
                    <div
                        className="navbar__profile-wrapper"
                        ref={menuRef}
                    >
                        <button
                            type="button"
                            className="navbar__profile"
                            onClick={() =>
                                setIsMenuOpen((prev) => !prev)
                            }
                        >
                            <img
                                src="https://i.pravatar.cc/100?img=12"
                                alt="Profile"
                            />
                        </button>

                        {/* Settings Menu */}
                        {isMenuOpen && (
                            <div className="navbar__menu">

                                <Link
                                    to="/profile"
                                    onClick={() =>
                                        setIsMenuOpen(false)
                                    }
                                >
                                    <span>👤</span>
                                    Profile
                                </Link>

                                <Link
                                    to="/settings"
                                    onClick={() =>
                                        setIsMenuOpen(false)
                                    }
                                >
                                    <span>⚙️</span>
                                    Settings
                                </Link>

                               

                                <div className="navbar__menu-divider" />

                                <button
                                    type="button"
                                    className="navbar__logout"
                                    onClick={() => {
                                        console.log("Logout");
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    <span>↪</span>
                                    Logout
                                </button>

                            </div>
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Navbar;