import { useContext } from 'react';
import { SongContext } from '../song.context';

import { uplodeSong, getSongByMood } from '../services/song.api';



export const useSong = () => {
    const context = useContext(SongContext)
    const { song, setSong, lodding, setLodding, moodList, setMoodList } = context

    const handelUplodeSong = async ({ mood, file }) => {
        setLodding(true)
        const data = await uplodeSong({ mood, file })
        setSong(data.song)
        setLodding(false)
    }

    const handelGetSongByMood = async ({ mood }) => {
        setLodding(true)
        const data = await getSongByMood({ mood })
        setSong(data.song)
        setLodding(false)
    }
    const handelgetMoodListSong = async ({ mood }) => {
        setLodding(true)
        const data = await getSongByMood({ mood })
        setMoodList(data.song)
        setLodding(false)
    }


    return {
        song,
        lodding,
        moodList,
        handelUplodeSong,
        handelGetSongByMood,
        handelgetMoodListSong,
    }

}

