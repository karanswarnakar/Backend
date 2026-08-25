import React, { useRef, useState, useEffect } from 'react'
import { useSong } from '../hooks/useSong'
import './player.scss'

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2]

const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00'

    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, '0')

    return `${m}:${s}`
}

const Player = () => {
    const {
        song,
        nextSong,
        previousSong
    } = useSong()

    const audioRef = useRef(null)
    const progressRef = useRef(null)

    const shouldAutoPlayRef = useRef(false)

    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    const [speed, setSpeed] = useState(1)

    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)

    const [showSpeed, setShowSpeed] = useState(false)

    const [isLooping, setIsLooping] = useState(false)

    /*
    |--------------------------------------------------------------------------
    | Song Change
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const audio = audioRef.current

        if (!audio || !song?.url) return

        audio.pause()
        audio.src = song.url
        audio.load()

        audio.playbackRate = speed
        audio.volume = isMuted ? 0 : volume
        audio.loop = isLooping

        setCurrentTime(0)
        setDuration(0)

        /*
         * If user was already playing and selected
         * next/previous, automatically continue playing.
         */
        if (shouldAutoPlayRef.current) {
            const playPromise = audio.play()

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true)
                    })
                    .catch(() => {
                        setIsPlaying(false)
                    })
            }

            shouldAutoPlayRef.current = false
        } else {
            setIsPlaying(false)
        }
    }, [song?.url])

    /*
    |--------------------------------------------------------------------------
    | Playback
    |--------------------------------------------------------------------------
    */

    const togglePlay = async () => {
        const audio = audioRef.current

        if (!audio || !song?.url) return

        try {
            if (audio.paused) {
                await audio.play()
                setIsPlaying(true)
            } else {
                audio.pause()
                setIsPlaying(false)
            }
        } catch (error) {
            console.error('Playback error:', error)
            setIsPlaying(false)
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Previous Song
    |--------------------------------------------------------------------------
    */

    const handlePrevious = () => {
        if (!previousSong) return

        shouldAutoPlayRef.current = isPlaying

        previousSong()
    }

    /*
    |--------------------------------------------------------------------------
    | Next Song
    |--------------------------------------------------------------------------
    */

    const handleNext = () => {
        if (!nextSong) return

        shouldAutoPlayRef.current = isPlaying

        nextSong()
    }

    /*
    |--------------------------------------------------------------------------
    | Skip
    |--------------------------------------------------------------------------
    */

    const skip = (seconds) => {
        const audio = audioRef.current

        if (!audio) return

        const newTime = Math.min(
            Math.max(audio.currentTime + seconds, 0),
            audio.duration || duration || 0
        )

        audio.currentTime = newTime

        setCurrentTime(newTime)
    }

    /*
    |--------------------------------------------------------------------------
    | Time Update
    |--------------------------------------------------------------------------
    */

    const handleTimeUpdate = () => {
        const audio = audioRef.current

        if (!audio) return

        setCurrentTime(audio.currentTime)
    }

    /*
    |--------------------------------------------------------------------------
    | Metadata
    |--------------------------------------------------------------------------
    */

    const handleLoadedMetadata = () => {
        const audio = audioRef.current

        if (!audio) return

        setDuration(audio.duration)

        audio.playbackRate = speed
        audio.volume = isMuted ? 0 : volume
        audio.loop = isLooping
    }

    /*
    |--------------------------------------------------------------------------
    | Progress Click
    |--------------------------------------------------------------------------
    */

    const handleProgressClick = (e) => {
        const audio = audioRef.current
        const bar = progressRef.current

        if (!audio || !bar || !duration) return

        const rect = bar.getBoundingClientRect()

        const ratio = Math.min(
            Math.max((e.clientX - rect.left) / rect.width, 0),
            1
        )

        const newTime = ratio * duration

        audio.currentTime = newTime

        setCurrentTime(newTime)
    }

    /*
    |--------------------------------------------------------------------------
    | Playback Speed
    |--------------------------------------------------------------------------
    */

    const handleSpeedChange = (newSpeed) => {
        const audio = audioRef.current

        setSpeed(newSpeed)
        setShowSpeed(false)

        if (audio) {
            audio.playbackRate = newSpeed
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Volume
    |--------------------------------------------------------------------------
    */

    const handleVolume = (e) => {
        const value = parseFloat(e.target.value)

        const audio = audioRef.current

        setVolume(value)

        if (audio) {
            audio.volume = value
        }

        setIsMuted(value === 0)
    }

    /*
    |--------------------------------------------------------------------------
    | Mute
    |--------------------------------------------------------------------------
    */

    const toggleMute = () => {
        const audio = audioRef.current

        if (!audio) return

        if (isMuted) {
            const restoredVolume = volume > 0 ? volume : 0.5

            audio.volume = restoredVolume

            setVolume(restoredVolume)
            setIsMuted(false)
        } else {
            audio.volume = 0

            setIsMuted(true)
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Loop
    |--------------------------------------------------------------------------
    */

    const toggleLoop = () => {
        const audio = audioRef.current

        const newLoopState = !isLooping

        setIsLooping(newLoopState)

        if (audio) {
            audio.loop = newLoopState
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Song End
    |--------------------------------------------------------------------------
    */

    const handleSongEnd = () => {
        /*
         * If loop is enabled, the browser handles looping.
         */
        if (isLooping) {
            return
        }

        setIsPlaying(false)
        setCurrentTime(0)

        /*
         * Automatically move to next song.
         */
        if (nextSong) {
            shouldAutoPlayRef.current = true

            nextSong()
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Keyboard Controls
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const handleKeyboard = (e) => {
            /*
             * Don't control player while typing.
             */
            const tag = e.target.tagName.toLowerCase()

            if (
                tag === 'input' ||
                tag === 'textarea' ||
                tag === 'button'
            ) {
                return
            }

            if (e.code === 'Space') {
                e.preventDefault()
                togglePlay()
            }

            if (e.code === 'ArrowRight') {
                skip(5)
            }

            if (e.code === 'ArrowLeft') {
                skip(-5)
            }
        }

        window.addEventListener('keydown', handleKeyboard)

        return () => {
            window.removeEventListener('keydown', handleKeyboard)
        }
    })

    /*
    |--------------------------------------------------------------------------
    | Progress
    |--------------------------------------------------------------------------
    */

    const progress = duration
        ? Math.min((currentTime / duration) * 100, 100)
        : 0

    /*
    |--------------------------------------------------------------------------
    | No Song
    |--------------------------------------------------------------------------
    */

    if (!song) {
        return null
    }

    /*
    |--------------------------------------------------------------------------
    | JSX
    |--------------------------------------------------------------------------
    */

    return (
        <div className="player">

            {/* =========================================================
                AUDIO
            ========================================================= */}

            <audio
                ref={audioRef}
                src={song.url}
                loop={isLooping}
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleSongEnd}
            />

            {/* =========================================================
                SONG INFO
            ========================================================= */}

            <div className="player__info">

                <img
                    className="player__poster"
                    src={song.posterUrl}
                    alt={song.title}
                />

                <div className="player__meta">

                    <p className="player__title">
                        {song.title}
                    </p>

                    <span className="player__mood">
                        {song.mood}
                    </span>

                </div>

            </div>

            {/* =========================================================
                PROGRESS
            ========================================================= */}

            <div className="player__progress-wrap">

                <span className="player__time">
                    {formatTime(currentTime)}
                </span>

                <div
                    className="player__progress"
                    ref={progressRef}
                    onClick={handleProgressClick}
                    role="slider"
                    aria-label="Song progress"
                >

                    <div
                        className="player__progress-fill"
                        style={{
                            width: `${progress}%`
                        }}
                    />

                    <div
                        className="player__progress-thumb"
                        style={{
                            left: `${progress}%`
                        }}
                    />

                </div>

                <span className="player__time">
                    {formatTime(duration)}
                </span>

            </div>

            {/* =========================================================
                CONTROLS
            ========================================================= */}

            <div className="player__controls">

                {/* =====================================================
                    SPEED
                ===================================================== */}

                <div className="player__speed-wrap">

                    <button
                        type="button"
                        className="player__btn player__btn--speed"
                        onClick={() =>
                            setShowSpeed((prev) => !prev)
                        }
                        title="Playback speed"
                    >
                        {speed}×
                    </button>

                    {showSpeed && (
                        <div className="player__speed-menu">

                            {SPEED_OPTIONS.map((option) => (
                                <button
                                    type="button"
                                    key={option}
                                    className={`player__speed-option ${
                                        option === speed
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        handleSpeedChange(option)
                                    }
                                >
                                    {option}×
                                </button>
                            ))}

                        </div>
                    )}

                </div>

                {/* =====================================================
                    PREVIOUS SONG
                ===================================================== */}

                <button
                    type="button"
                    className="player__btn player__btn--prev"
                    onClick={handlePrevious}
                    title="Previous song"
                >

                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="21"
                        height="21"
                    >
                        <rect
                            x="5"
                            y="5"
                            width="2"
                            height="14"
                        />

                        <path d="M19 5v14l-10-7 10-7z" />
                    </svg>

                </button>

                {/* =====================================================
                    BACK 5 SECONDS
                ===================================================== */}

                <button
                    type="button"
                    className="player__btn player__btn--skip"
                    onClick={() => skip(-5)}
                    title="Back 5 seconds"
                >

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        width="20"
                        height="20"
                    >
                        <path d="M1 4v6h6" />
                        <path d="M3.51 15a9 9 0 1 0 .49-3.6" />
                    </svg>

                    <span>5s</span>

                </button>

                {/* =====================================================
                    PLAY / PAUSE
                ===================================================== */}

                <button
                    type="button"
                    className="player__btn player__btn--play"
                    onClick={togglePlay}
                    title={isPlaying ? 'Pause' : 'Play'}
                >

                    {isPlaying ? (

                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            width="28"
                            height="28"
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
                            width="28"
                            height="28"
                        >
                            <path d="M8 5.14v14l11-7-11-7z" />
                        </svg>

                    )}

                </button>

                {/* =====================================================
                    FORWARD 5 SECONDS
                ===================================================== */}

                <button
                    type="button"
                    className="player__btn player__btn--skip"
                    onClick={() => skip(5)}
                    title="Forward 5 seconds"
                >

                    <span>5s</span>

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        width="20"
                        height="20"
                    >
                        <path d="M23 4v6h-6" />
                        <path d="M20.49 15a9 9 0 1 1-.49-3.6" />
                    </svg>

                </button>

                {/* =====================================================
                    NEXT SONG
                ===================================================== */}

                <button
                    type="button"
                    className="player__btn player__btn--next"
                    onClick={handleNext}
                    title="Next song"
                >

                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="21"
                        height="21"
                    >
                        <path d="M5 5v14l10-7L5 5z" />

                        <rect
                            x="17"
                            y="5"
                            width="2"
                            height="14"
                        />
                    </svg>

                </button>

                {/* =====================================================
                    LOOP
                ===================================================== */}

                <button
                    type="button"
                    className={`player__btn player__btn--loop ${
                        isLooping ? 'active' : ''
                    }`}
                    onClick={toggleLoop}
                    title={
                        isLooping
                            ? 'Disable loop'
                            : 'Enable loop'
                    }
                    aria-label={
                        isLooping
                            ? 'Disable loop'
                            : 'Enable loop'
                    }
                >

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        width="20"
                        height="20"
                    >
                        <path d="M17 1l4 4-4 4" />

                        <path d="M3 11V9a4 4 0 0 1 4-4h14" />

                        <path d="M7 23l-4-4 4-4" />

                        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                    </svg>

                </button>

                {/* =====================================================
                    VOLUME
                ===================================================== */}

                <div className="player__volume">

                    <button
                        type="button"
                        className="player__btn player__btn--vol"
                        onClick={toggleMute}
                        title={isMuted ? 'Unmute' : 'Mute'}
                    >

                        {isMuted || volume === 0 ? (

                            /* MUTED */

                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                width="20"
                                height="20"
                            >
                                <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63z" />

                                <path d="M18.99 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.87 8.87 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71z" />

                                <path d="M4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 18L19 19.27 20.27 18 5.27 3 4.27 3z" />

                                <path d="M12 4L9.91 6.09 12 8.18V4z" />
                            </svg>

                        ) : (

                            /* VOLUME */

                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                width="20"
                                height="20"
                            >
                                <path d="M3 9v6h4l5 5V4L7 9H3z" />

                                <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />

                                <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                            </svg>

                        )}

                    </button>

                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolume}
                        className="player__volume-slider"
                        aria-label="Volume"
                    />

                </div>

            </div>

        </div>
    )
}

export default Player