import { useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../auth/hooks/useAuth.js";
import { updatePrivacy } from "../profile/services/profile.api.js";
import { useTheme } from "../shared/theme.hook.js";
import "./settings.scss";

const SettingsPage = () => {
    const { user, setUser } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [savingPrivacy, setSavingPrivacy] = useState(false);
    const [error, setError] = useState("");

    const togglePrivacy = async () => {
        if (savingPrivacy) return;
        setSavingPrivacy(true);
        setError("");
        try {
            const result = await updatePrivacy(!user.isPrivate);
            setUser(current => ({ ...current, isPrivate: result.user.isPrivate }));
        } catch (requestError) {
            console.error("Failed to update account privacy:", requestError);
            setError(requestError.response?.data?.message || "Privacy settings could not be updated. Please try again.");
        } finally {
            setSavingPrivacy(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="settings-page">
                <header className="settings-page__heading">
                    <span className="settings-page__eyebrow">YOUR ACCOUNT</span>
                    <h1>Settings</h1>
                    <p>Manage your account and how people see you on Socially.</p>
                </header>

                {error && <p className="settings-page__error" role="alert">{error}</p>}

                <section className="settings-card" aria-labelledby="privacy-heading">
                    <div className="settings-card__icon" aria-hidden="true">◈</div>
                    <div className="settings-card__content">
                        <div>
                            <h2 id="privacy-heading">Account privacy</h2>
                            <p>{user.isPrivate
                                ? "Only followers you approve can see your posts and profile details."
                                : "Your profile and posts are visible to everyone, including people who are not signed in."}</p>
                        </div>
                    </div>
                    <div className="settings-card__control">
                        <button
                            type="button"
                            className={`settings-switch${user.isPrivate ? " is-on" : ""}`}
                            role="switch"
                            aria-checked={Boolean(user.isPrivate)}
                            aria-label="Private account"
                            disabled={savingPrivacy}
                            onClick={togglePrivacy}
                        >
                            <span />
                        </button>
                        <span className="settings-card__status">
                            {savingPrivacy ? "Saving…" : user.isPrivate ? "Private" : "Public"}
                        </span>
                    </div>
                </section>

                <section className="settings-card" aria-labelledby="theme-heading">
                    <div className="settings-card__icon settings-card__icon--theme" aria-hidden="true">
                        {theme === "dark" ? "☾" : "☀"}
                    </div>
                    <div className="settings-card__content">
                        <div>
                            <h2 id="theme-heading">Appearance</h2>
                            <p>Choose a comfortable look. Your preference is saved on this device.</p>
                        </div>
                    </div>
                    <div className="settings-card__control">
                        <button
                            type="button"
                            className={`settings-switch${theme === "light" ? " is-on" : ""}`}
                            role="switch"
                            aria-checked={theme === "light"}
                            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                            onClick={toggleTheme}
                        >
                            <span />
                        </button>
                        <span className="settings-card__status">{theme === "dark" ? "Dark mode" : "Light mode"}</span>
                    </div>
                </section>

                <section className="settings-card settings-card--links" aria-labelledby="account-heading">
                    <div className="settings-card__content">
                        <div>
                            <h2 id="account-heading">Account</h2>
                            <p>Signed in as <strong>@{user.username}</strong></p>
                        </div>
                        <Link to={`/profile/${encodeURIComponent(user.username)}`}>View profile <span aria-hidden="true">→</span></Link>
                    </div>
                </section>

                <section className="settings-card settings-card--links" aria-labelledby="policies-heading">
                    <div className="settings-card__content">
                        <div>
                            <h2 id="policies-heading">Policies</h2>
                            <p>Review how Socially handles account data and session cookies.</p>
                        </div>
                        <div className="settings-page__policy-links">
                            <Link to="/privacy">Privacy</Link>
                            <Link to="/cookies">Cookies</Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default SettingsPage;
