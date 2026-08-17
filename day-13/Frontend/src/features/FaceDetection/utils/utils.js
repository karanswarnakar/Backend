import {
    FaceLandmarker,
    FilesetResolver,
} from "@mediapipe/tasks-vision";


export const detect = ({
    videoRef,
    faceLandmarkerRef,
    setMood,
}) => {

    const video = videoRef.current;

    const faceLandmarker =
        faceLandmarkerRef.current;


    if (!video || !faceLandmarker) {
        return;
    }

    if (video.readyState < 2) {
        return;
    }


    const results =
        faceLandmarker.detectForVideo(
            video,
            performance.now()
        );


    if (
        !results.faceBlendshapes ||
        results.faceBlendshapes.length === 0
    ) {
        setMood("No face detected");
        return;
    }


    const categories =
        results.faceBlendshapes[0].categories;


    const getScore = (name) => {

        const category =
            categories.find(
                (item) =>
                    item.categoryName === name
            );

        return category?.score ?? 0;
    };


    const smile =
        (
            getScore("mouthSmileLeft") +
            getScore("mouthSmileRight")
        ) / 2;


    const frown =
        (
            getScore("mouthFrownLeft") +
            getScore("mouthFrownRight")
        ) / 2;


    const browDown =
        (
            getScore("browDownLeft") +
            getScore("browDownRight")
        ) / 2;


    const jawOpen =
        getScore("jawOpen");


    const eyeWide =
        (
            getScore("eyeWideLeft") +
            getScore("eyeWideRight")
        ) / 2;


    const browUp =
        (
            getScore("browOuterUpLeft") +
            getScore("browOuterUpRight")
        ) / 2;


    let currentMood = "Neutral 😐";


    if (
        jawOpen > 0.10 &&
        eyeWide > 0.10 &&
        browUp > 0.10
    ) {
        currentMood = "Surprised 😮";

    } else if (
        smile > 0.35
    ) {
        currentMood = "Happy 😊";

    } else if (
        frown > 0.05 ||
        browDown > 0.20
    ) {
        currentMood = "Sad 😢";
    }


    setMood(currentMood);
};


export const init = async ({
    videoRef,
    faceLandmarkerRef,
    streamRef,
    animationRef,
    setMood,
    setError,
}) => {

    try {

        setMood("Loading...");
        setError("");


        // ================================
        // MEDIAPIPE
        // ================================

        const vision =
            await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );


        const faceLandmarker =
            await FaceLandmarker.createFromOptions(
                vision,
                {
                    baseOptions: {
                        modelAssetPath:
                            "/models/face_landmarker.task",
                    },

                    runningMode: "VIDEO",

                    numFaces: 1,

                    outputFaceBlendshapes: true,

                    outputFacialTransformationMatrixes: true,

                    minFaceDetectionConfidence: 0.5,

                    minFacePresenceConfidence: 0.5,

                    minTrackingConfidence: 0.5,
                }
            );


        faceLandmarkerRef.current =
            faceLandmarker;


        // ================================
        // CAMERA
        // ================================

        const stream =
            await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 640,
                    height: 480,
                    facingMode: "user",
                },

                audio: false,
            });


        streamRef.current = stream;


        // ================================
        // VIDEO
        // ================================

        const video =
            videoRef.current;


        if (!video) {
            throw new Error(
                "Video element does not exist"
            );
        }


        video.srcObject = stream;


        await new Promise((resolve) => {

            if (video.readyState >= 1) {
                resolve();
                return;
            }

            video.onloadedmetadata = resolve;
        });


        await video.play();


        // ================================
        // DETECTION LOOP
        // ================================

        const loop = () => {

            detect({
                videoRef,
                faceLandmarkerRef,
                setMood,
            });


            animationRef.current =
                requestAnimationFrame(loop);
        };


        loop();

    } catch (err) {

        console.error(
            "Initialization Error:",
            err
        );


        setMood("Error");


        setError(
            err?.message ||
            "Something went wrong"
        );
    }
};


export const cleanup = ({
    videoRef,
    faceLandmarkerRef,
    streamRef,
    animationRef,
}) => {

    // ================================
    // STOP LOOP
    // ================================

    if (animationRef.current) {

        cancelAnimationFrame(
            animationRef.current
        );

        animationRef.current = null;
    }


    // ================================
    // STOP CAMERA
    // ================================

    if (streamRef.current) {

        streamRef.current
            .getTracks()
            .forEach((track) => {
                track.stop();
            });

        streamRef.current = null;
    }


    // ================================
    // CLEAR VIDEO
    // ================================

    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }


    // ================================
    // CLOSE MEDIAPIPE
    // ================================

    if (faceLandmarkerRef.current) {

        faceLandmarkerRef.current.close();

        faceLandmarkerRef.current = null;
    }
};