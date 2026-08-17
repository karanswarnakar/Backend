import { useEffect, useRef, useState } from "react";

import {
    init,
    cleanup,
} from "../utils/utils";


const MoodDetector = () => {

    const videoRef = useRef(null);
    const faceLandmarkerRef = useRef(null);
    const streamRef = useRef(null);
    const animationRef = useRef(null);
    const [mood, setMood] = useState("Loading...");
    const [error, setError] = useState("");


    useEffect(() => {

        init({
            videoRef,
            faceLandmarkerRef,
            streamRef,
            animationRef,
            setMood,
            setError,
        });

        return () => {

            cleanup({
                videoRef,
                faceLandmarkerRef,
                streamRef,
                animationRef,
            });

        };

    }, []);


    return (
        <div style={{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            flexFlow:"column",
            height:"100vh",
            gap:"1rem",
            fontFamily:"system-ui"
        }}>

            <h1>
                Face Mood Detector
            </h1>

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
               style={{
                borderRadius:".75rem",
               }}
            />

            <h2>
                {mood}
            </h2>

            {error && (
                <p>
                    {error}
                </p>
            )}

        </div>
    );
};


export default MoodDetector;