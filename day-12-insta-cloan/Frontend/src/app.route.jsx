import { createBrowserRouter } from "react-router";
import Login from './features/auth/pages/Login.jsx'
import Register from './features/auth/pages/Register.jsx'
import Feed from "./features/post/pages/Feed.jsx";
import ProfilePage from "./features/post/pages/ProfilePage.jsx";
import CreatePost from "./features/post/pages/CreatePost.jsx";


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
        element: <Feed />
    },
    {
        path: "/create-post",
        element: <CreatePost/>
    },
    {
        path: "/profile",
        element: <ProfilePage/>
    }
])
