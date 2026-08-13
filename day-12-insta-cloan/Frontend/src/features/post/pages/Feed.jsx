import React from 'react'
import '../style/feed.scss';
import Post from '../components/Post'; 
import { usePost } from '../hooks/usePost';
import { useEffect } from 'react';


const Feed = () => {

    const {feed, lodding, hendelFeed} = usePost()

    useEffect(() => {
      hendelFeed()
    }, [])
    
    
    if(lodding || !feed){
        return (
            <main className='contener'>
                <h1>Feed lodding....</h1>
            </main>
        )
    }
    return (
        <main className='contener'>
            <div className="feed-contener">
               <div className="posts">
                 {feed.map((post,idx)=>{
                    return <Post user={post.user} post={post}/>
                 })}
               </div>
            </div>
        </main>
    )
}

export default Feed
