import { useState, createContext } from "react";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [feed, setFeed] = useState([]);
    const [post, setPost] = useState(null);
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false);
    
    return (
        <PostContext.Provider
            value={{
                feed,
                setFeed,

                post,
                setPost,

                user,
                setUser,

                loading,
                setLoading
            }}
        >
            {children}
        </PostContext.Provider>
    );
};