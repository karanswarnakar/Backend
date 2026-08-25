import { createContext, useState } from 'react'

export const SongContext = createContext()

export const SongContextProvider = ({ children }) => {

    const [song, setSong] = useState(null)

    // All songs currently available in the player
    const [songs, setSongs] = useState([])

    // Current song position
    const [currentIndex, setCurrentIndex] = useState(-1)

    // Songs returned for selected mood
    const [moodList, setMoodList] = useState([])

    const [lodding, setLodding] = useState(false)


    // ---------------------------------------
    // Select song from SongList
    // ---------------------------------------

    const selectSong = (selectedSong, index = -1) => {

        setSong(selectedSong)

        if (index >= 0) {

            setCurrentIndex(index)

        } else {

            const foundIndex = songs.findIndex(
                item => item._id === selectedSong._id
            )

            setCurrentIndex(foundIndex)
        }
    }


    // ---------------------------------------
    // Next Song
    // ---------------------------------------

    const nextSong = () => {

        if (!songs.length) return

        const nextIndex =
            currentIndex >= songs.length - 1
                ? 0
                : currentIndex + 1

        setCurrentIndex(nextIndex)
        setSong(songs[nextIndex])
    }


    // ---------------------------------------
    // Previous Song
    // ---------------------------------------

    const previousSong = () => {

        if (!songs.length) return

        const previousIndex =
            currentIndex <= 0
                ? songs.length - 1
                : currentIndex - 1

        setCurrentIndex(previousIndex)
        setSong(songs[previousIndex])
    }


    return (
        <SongContext.Provider
            value={{
                // Current song
                song,
                setSong,

                // Playlist
                songs,
                setSongs,

                // Current position
                currentIndex,
                setCurrentIndex,

                // Player functions
                selectSong,
                nextSong,
                previousSong,

                // Mood
                moodList,
                setMoodList,

                // Loading
                lodding,
                setLodding
            }}
        >
            {children}
        </SongContext.Provider>
    )
}