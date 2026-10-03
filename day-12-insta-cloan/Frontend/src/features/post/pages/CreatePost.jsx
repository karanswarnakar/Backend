import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../components/Navbar";
import { usePost } from "../hooks/usePost";
import LeftPanel from "../components/LeftPanel";
import "../style/create-post.scss";

const FILTERS = [
    { name: "Original", value: "none" },
    { name: "Warm", value: "sepia(.2) saturate(1.2) brightness(1.04)" },
    { name: "Mono", value: "grayscale(1) contrast(1.08)" },
    { name: "Soft", value: "saturate(.8) brightness(1.08) contrast(.94)" },
    { name: "Vivid", value: "saturate(1.35) contrast(1.08)" }
];

function exportFilteredImage(file, filter) {
    return new Promise((resolve, reject) => {
        const sourceUrl = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => {
            URL.revokeObjectURL(sourceUrl);
            const canvas = document.createElement("canvas");
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            const context = canvas.getContext("2d");
            if (!context) {
                reject(new Error("Image editing is unavailable in this browser."));
                return;
            }
            context.filter = filter === "none" ? "none" : filter;
            context.drawImage(image, 0, 0);
            canvas.toBlob(blob => {
                if (!blob) {
                    reject(new Error("The filtered image could not be prepared."));
                    return;
                }
                const extension = blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg";
                resolve(new File([blob], `socially-post.${extension}`, { type: blob.type || file.type }));
            }, file.type, .92);
        };
        image.onerror = () => {
            URL.revokeObjectURL(sourceUrl);
            reject(new Error("The selected image could not be opened."));
        };
        image.src = sourceUrl;
    });
}

const CreatePost = () => {
    const { loading, handelCreatePost } = usePost();
    const navigate = useNavigate();
    const [caption, setCaption] = useState("");
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!file) {
            setPreviewUrl("");
            return undefined;
        }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const handleFileChange = event => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;
        if (!["image/jpeg", "image/png", "image/webp"].includes(selectedFile.type)) {
            setError("Choose a JPG, PNG, or WebP image.");
            event.target.value = "";
            return;
        }
        setError("");
        setActiveFilter(FILTERS[0]);
        setFile(selectedFile);
    };

    const handleSubmit = async event => {
        event.preventDefault();
        if (!file || loading) return;
        setError("");
        try {
            const upload = await exportFilteredImage(file, activeFilter.value);
            await handelCreatePost(upload, caption.trim());
            navigate("/");
        } catch (createError) {
            console.error("Failed to create post:", createError);
            setError(createError.response?.data?.message || createError.message || "Your post could not be created.");
        }
    };

    return (
        <>
            <Navbar />
            <main className="contener create-post-layout">
                <LeftPanel />
                <section className="create-post">
                    <header className="create-post__heading">
                        <h1>Create Post</h1>
                    </header>

                    <form className="create-post__workspace" onSubmit={handleSubmit}>
                        <div className="create-post__preview-column">
                            <label className={`create-post__preview${file ? " has-image" : ""}`} htmlFor="post-image">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Post preview"
                                        style={{ filter: activeFilter.value === "none" ? "none" : activeFilter.value }}
                                    />
                                ) : (
                                    <span className="create-post__upload-prompt">Select an image (JPG, PNG, WebP)</span>
                                )}
                                <input id="post-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} />
                            </label>
                            {file && (
                                <div className="create-post__filters" aria-label="Image filters">
                                    <span>Filters</span>
                                    <div>
                                        {FILTERS.map(filter => (
                                            <button
                                                key={filter.name}
                                                type="button"
                                                className={activeFilter.name === filter.name ? "is-active" : ""}
                                                aria-pressed={activeFilter.name === filter.name}
                                                onClick={() => setActiveFilter(filter)}
                                            >
                                                {filter.name}
                                            </button>
                                        ))}
                                    </div>
                                    <small>Applied to the shared image.</small>
                                </div>
                            )}
                        </div>

                        <div className="create-post__details">
                            {file && <p className="create-post__filename" title={file.name}>{file.name}</p>}
                            <label className="create-post__caption-label" htmlFor="post-caption">Caption</label>
                            <textarea
                                id="post-caption"
                                name="caption"
                                placeholder="Write a caption…"
                                maxLength={2200}
                                value={caption}
                                onChange={event => setCaption(event.target.value)}
                            />
                            <div className="create-post__caption-meta"><span>Caption</span><span>{caption.length}/2200</span></div>
                            {error && <p className="create-post__error" role="alert">{error}</p>}
                            <button className="create-post__submit" type="submit" disabled={!file || loading}>
                                {loading ? "Creating post…" : "Create Post"}
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </>
    );
};

export default CreatePost;
