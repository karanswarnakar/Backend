import React from 'react'
import FaceExpression from '../../FaceDetection/pages/FaceExpression'
import Player from '../components/Player'
import { useSong } from '../hooks/useSong'
import SongList from '../components/SongList'

const Home = () => {

    const { handelGetSongByMood } = useSong()

    const songs = [
        {
            _id: '1',
            title: 'Dreams',
            mood: 'happy',
            url: '/songs/dreams.mp3',
            posterUrl: '/images/dreams.jpg'
        },
        {
            _id: '2',
            title: 'Night Drive',
            mood: 'chill',
            url: '/songs/night-drive.mp3',
            posterUrl: '/images/night-drive.jpg'
        },
        {
            _id: '3',
            title: 'Memories',
            mood: 'sad',
            url: '/songs/memories.mp3',
            posterUrl: '/images/memories.jpg'
        }
    ]
    return (
        <>
            <FaceExpression
                onClick={(expression) => { handelGetSongByMood({ mood: expression }) }}
            />
            <Player />
            <SongList songs={songs} />
        </>
    )
}

export default Home