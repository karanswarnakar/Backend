import React from "react";
import "./navbar.scss";

const Navbar = () => {
    return (
        <header className="navbar">
            <div className="navbar__inner">

                {/* Brand */}
                <div className="navbar__brand">
                    <div className="navbar__brand-logo">
                        S
                    </div>

                    <span className="navbar__brand-name">
                        Social<span>Sphere</span>
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
                        placeholder="Search..."
                    />
                </div>


                {/* Actions */}
                <div className="navbar__actions">

                    <button className="navbar__create">
                        <span>+</span>
                        <span className="navbar__create-text">
                            Create
                        </span>
                    </button>


                    <button className="navbar__profile">

                        <img
                            src="https://i.pravatar.cc/100?img=12"
                            alt="Profile"
                        />

                    </button>

                </div>

            </div>
        </header>
    );
};

export default Navbar;