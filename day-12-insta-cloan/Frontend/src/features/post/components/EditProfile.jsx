import { useState } from "react";

import "../style/profile.scss";

const EditProfile = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: "Karan Swarnakar",
        username: "karan",
        bio: "Developer • Creator • Student",
        website: "mywebsite.com",
        location: "Kolkata, India",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(formData);
        onClose();
    };

    return (
        <div className="edit-profile">
            <div className="edit-profile__overlay">
                <div className="edit-profile__modal">

                    <div className="edit-profile__header">
                        <h2>Edit profile</h2>

                        <button
                            type="button"
                            className="edit-profile__close"
                            onClick={onClose}
                        >
                            ×
                        </button>
                    </div>

                    <form
                        className="edit-profile__form"
                        onSubmit={handleSubmit}
                    >

                        <div className="edit-profile__photo">
                            <div className="edit-profile__avatar">
                                <img
                                    src="https://i.pravatar.cc/300?img=12"
                                    alt="profile"
                                />
                            </div>

                            <button
                                type="button"
                                className="edit-profile__change-photo"
                            >
                                Change photo
                            </button>
                        </div>

                        <div className="edit-profile__field">
                            <label htmlFor="name">
                                Name
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="edit-profile__field">
                            <label htmlFor="username">
                                Username
                            </label>

                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="edit-profile__field">
                            <label htmlFor="bio">
                                Bio
                            </label>

                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                maxLength={160}
                            />

                            <span>
                                {formData.bio.length}/160
                            </span>
                        </div>

                        <div className="edit-profile__field">
                            <label htmlFor="website">
                                Website
                            </label>

                            <input
                                id="website"
                                name="website"
                                type="text"
                                value={formData.website}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="edit-profile__field">
                            <label htmlFor="location">
                                Location
                            </label>

                            <input
                                id="location"
                                name="location"
                                type="text"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="edit-profile__actions">
                            <button
                                type="button"
                                className="edit-profile__cancel"
                                onClick={onClose}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="edit-profile__save"
                            >
                                Save changes
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
