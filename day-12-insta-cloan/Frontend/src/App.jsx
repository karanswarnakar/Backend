import { RouterProvider } from "react-router";
import { router } from "./app.route";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { PostProvider } from "./features/post/post.context.jsx";
import { ProfileProvider } from "./features/profile/profile.context.jsx";

function App() {
    return (
        <AuthProvider>
            <PostProvider>
                <ProfileProvider>
                    <RouterProvider router={router} />
                </ProfileProvider>
            </PostProvider>
        </AuthProvider>
    );
}

export default App;