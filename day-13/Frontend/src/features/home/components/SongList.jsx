import React from 'react'
import { useSong } from '../hooks/useSong'
import './song-list.scss'

const SongList = ({ songs }) => {
    const {
        song,
        setSong
    } = useSong()

    const handlePlay = (selectedSong) => {
        setSong(selectedSong)
    }

    return (
        <div className="song-list">

            {songs?.map((item, index) => {

                const isCurrent =
                    song?._id === item._id

                return (
                    <div
                        className={`song-list__item ${
                            isCurrent
                                ? 'song-list__item--active'
                                : ''
                        }`}
                        key={item._id || index}
                    >

                        {/* Poster */}

                        <img
                            className="song-list__poster"
                            src={item.posterUrl}
                            alt={item.title}
                        />

                        {/* Song Info */}

                        <div className="song-list__info">

                            <h3>
                                {item.title}
                            </h3>

                            <span>
                                {item.mood}
                            </span>

                        </div>

                        {/* Play Button */}

                        <button
                            className="song-list__play"
                            onClick={() => handlePlay(item)}
                        >

                            {isCurrent ? (
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    width="20"
                                    height="20"
                                >
                                    <rect
                                        x="6"
                                        y="4"
                                        width="4"
                                        height="16"
                                        rx="1"
                                    />

                                    <rect
                                        x="14"
                                        y="4"
                                        width="4"
                                        height="16"
                                        rx="1"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    width="20"
                                    height="20"
                                >
                                    <path d="M8 5.14v14l11-7-11-7z" />
                                </svg>
                            )}

                        </button>

                    </div>
                )
            })}

        </div>
    )
}

export default SongList