import { RouterProvider } from "react-router";
import { router } from "./app.route";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { PostProvider } from "./features/post/post.context.jsx";
import { ProfileProvider } from "./features/profile/profile.context.jsx";
import { ThemeProvider } from "./features/shared/theme.provider.jsx";

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <PostProvider>
                    <ProfileProvider>
                        <RouterProvider router={router} />
                    </ProfileProvider>
                </PostProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;