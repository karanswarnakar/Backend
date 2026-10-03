import { createBrowserRouter } from "react-router";
import Login from './features/auth/pages/Login.jsx'
import Register from './features/auth/pages/Register.jsx'
import Feed from "./features/post/pages/Feed.jsx";
import CreatePost from "./features/post/pages/CreatePost.jsx";
import ProfilePage from "./features/profile/pages/ProfilePage.jsx";
import EditProfile from "./features/profile/pages/EditProfile.jsx";
import PageNotFound from "./features/components/PageNotFound.jsx";
import Protected from "./features/components/Protected.jsx";
import SavedPosts from "./features/post/pages/SavedPosts.jsx";
import Onboarding from "./features/onboarding/Onboarding.jsx";
import Network from "./features/post/pages/Network.jsx";
import Explore from "./features/post/pages/Explore.jsx";
import PostDetails from "./features/post/pages/PostDetails.jsx";
import Messages from "./features/messages/Messages.jsx";
import NotificationsPage from "./features/notifications/NotificationsPage.jsx";
import LegalPage from "./features/components/LegalPage.jsx";
import SettingsPage from "./features/settings/SettingsPage.jsx";


export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <Protected><Feed /></Protected>
    },
    {
        path: "/onboarding",
        element: <Protected><Onboarding /></Protected>
    },
    {
        path: "/create-post",
        element: <Protected><CreatePost/></Protected>
    },
    {
        path: "/saved",
        element: <Protected><SavedPosts /></Protected>
    },
    {
        path: "/network",
        element: <Protected><Network /></Protected>
    },
    {
        path: "/explore",
        element: <Explore />
    },
    {
        path: "/post/:postId",
        element: <PostDetails />
    },
    {
        path: "/messages",
        element: <Protected><Messages /></Protected>
    },
    {
        path: "/settings",
        element: <Protected><SettingsPage /></Protected>
    },
    {
        path: "/notifications",
        element: <Protected><NotificationsPage /></Protected>
    },
    {
        path: "/profile",
        element: <Protected><ProfilePage/></Protected>
    },
    {
        path: "/profile/:username",
        element: <ProfilePage/>
    },
    {
        path: "/privacy",
        element: <LegalPage page="privacy" />
    },
    {
        path: "/cookies",
        element: <LegalPage page="cookies" />
    },
    {
        path: "/profile/edit",
        element: <Protected><EditProfile/></Protected>
    },
    {
        path: "/*",
        element: <PageNotFound/>
    }
])
