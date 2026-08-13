import { getFeed } from '../services/post.api'
import { PostContext } from '../post.context'
import { useContext } from 'react'



export const usePost = () => {
    const context = useContext(PostContext)
    const { feed, setFeed, post, setPost, lodding, setLodding } = context

    async function hendelFeed() {
        setLodding(true)
        const res = await getFeed()
        setFeed(res.posts)
        setLodding(false)
    }

    return {
        feed, lodding, hendelFeed
    }

}