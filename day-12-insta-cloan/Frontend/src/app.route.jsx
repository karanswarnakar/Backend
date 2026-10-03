import { createBrowserRouter } from "react-router";
import Login from './features/auth/pages/Login.jsx'
import Register from './features/auth/pages/Register.jsx'
import Feed from "./features/post/pages/Feed.jsx";
import CreatePost from "./features/post/pages/CreatePost.jsx";
import ProfilePage from "./features/profile/pages/ProfilePage.jsx";
import EditProfile from "./features/profile/pages/EditProfile.jsx";
import PageNotFound from "./features/components/PageNotFound.jsx";
import Protected from "./features/components/Protected.jsx";


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
        path: "/create-post",
        element: <Protected><CreatePost/></Protected>
    },
    {
        path: "/profile",
        element: <Protected><ProfilePage/></Protected>
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
