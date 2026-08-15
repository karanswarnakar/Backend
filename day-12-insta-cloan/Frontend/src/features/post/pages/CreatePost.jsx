import React, { useState } from "react";
import "../style/create-post.scss";
import { usePost } from "../hooks/usePost";
import { useNavigate } from "react-router";
import Navbar from "../../components/Navbar";
const CreatePost = () => {
    const {lodding, handelCreatePost } = usePost();
    const navigate = useNavigate()

    const [caption, setCaption] = useState("");
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        await handelCreatePost(file, caption);
        navigate("/")
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    if (lodding) {
        return (
            <main>
                <h1>Creating post....</h1>
            </main>
        )
    }
    return (
        <>
        <Navbar />
        <main>
            <div className="form-container">
                <h1>Create Post</h1>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter caption"
                        autoComplete="off"
                        name="caption"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />

                    <label htmlFor="file">
                        {file ? file.name : "Select File"}
                    </label>

                    <input
                        type="file"
                        hidden
                        id="file"
                        onChange={handleFileChange}
                    />

                    <button
                        className="button btn-primary"
                        type="submit">
                        Create Post
                    </button>
                </form>
            </div>
        </main>
        </>
    );
};

export default CreatePost;