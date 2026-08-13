import { useState } from "react";
import { createContext } from "react";



export const PostContext = createContext()

export const PostProvider = ({ children }) => {
    const [feed, setFeed] = useState(null)
    const [post, setPost] = useState(null)
    const [lodding, setLodding] = useState(false)

    return (
        <PostContext.Provider value={{feed, setFeed, post, setPost, lodding, setLodding}}>
            {children}
        </PostContext.Provider>
    )
}