import { Link } from "react-router";
import Navbar from "./Navbar.jsx";
import "./legal.scss";

const policies = {
    privacy: {
        title: "Privacy policy",
        updated: "October 3, 2026",
        sections: [
            ["Information we use", "Socially stores account information you provide, such as your username, email address, profile image, onboarding choices, posts, comments, follows, saved posts, and messages."],
            ["How the information is used", "Account data is used to operate profiles, feeds, follow requests, bookmarks, notifications, and direct messages. Public posts and public profiles can be viewed without signing in. Private profiles and their posts are shown only to their owner and accepted followers."],
            ["Session security", "When you sign in, Socially uses an HTTP-only session cookie. In production the cookie is configured as Secure and SameSite=Lax. The browser does not expose the HTTP-only token to page scripts."],
            ["Your choices", "You may edit your profile and account privacy in the application. You can remove your posts, comments, saved posts, and follow relationships using the controls provided."],
            ["Data retention and contact", "Account and content data is retained while the corresponding account or content remains active. For questions, contact the person or organization operating this Socially instance."]
        ]
    },
    cookies: {
        title: "Cookie policy",
        updated: "October 3, 2026",
        sections: [
            ["Essential session cookie", "Socially sets a cookie named token after you sign in or register. It carries the session token used to authenticate requests. The cookie is HTTP-only and SameSite=Lax; production deployments also set Secure."],
            ["No advertising cookies", "This application does not intentionally set advertising or cross-site tracking cookies. Your browser, hosting provider, or external image provider may have separate policies."],
            ["Managing your session", "You can sign out from the account menu to invalidate your session and clear the cookie. Blocking essential cookies prevents sign-in and authenticated features from working."],
            ["Development deployments", "The local development environment uses HTTP, so the Secure flag is disabled there. Production must be served over HTTPS."]
        ]
    }
};

const LegalPage = ({ page }) => {
    const policy = policies[page] || policies.privacy;
    return (
        <>
            <Navbar />
            <main className="legal-page">
                <header>
                    <p>Socially · Policies</p>
                    <h1>{policy.title}</h1>
                    <small>Last updated {policy.updated}</small>
                </header>
                {policy.sections.map(([heading, content]) => (
                    <section key={heading}>
                        <h2>{heading}</h2>
                        <p>{content}</p>
                    </section>
                ))}
                <nav aria-label="Other policies">
                    <Link to="/privacy">Privacy</Link>
                    <Link to="/cookies">Cookies</Link>
                    <Link to="/explore">Back to Socially</Link>
                </nav>
                <p className="legal-page__disclaimer">This page describes the current behavior of this application and is not legal advice. Review it with appropriate counsel before using Socially in a production service.</p>
            </main>
        </>
    );
};

export default LegalPage;
