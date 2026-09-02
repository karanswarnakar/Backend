import React, { useEffect, useState } from "react";
import "../style/profile.scss";
import { useProfile } from "../hooks/useProfile";

const Profile = () => {
    const { profile } = useProfile();

    const [activeTab, setActiveTab] = useState("Posts");

    // Scroll to top when profile changes
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
        });
    }, [profile?.username]);

    if (!profile) {
        return <div>Loading...</div>;
    }

    const posts = [
        "https://picsum.photos/500/500?random=1",
        "https://picsum.photos/500/500?random=2",
        "https://picsum.photos/500/500?random=3",
        "https://picsum.photos/500/500?random=4",
        "https://picsum.photos/500/500?random=5",
        "https://picsum.photos/500/500?random=6",
    ];

    const tabs = ["Posts", "Replies", "Media", "Likes"];

    return (
        <div className="profile">
            
            <div className="profile__header">

                <div className="profile__top">

                    <div className="profile__avatar">
                        <img
                            src={profile.profileImage}
                            alt={profile.username}
                        />
                    </div>

                    <div className="profile__info">

                        <div className="profile__name">
                            <h2>{profile.username}</h2>

                            <span className="profile__verified">
                                ✓
                            </span>
                        </div>

                        <p className="profile__username">
                            @{profile.username}
                        </p>

                        <div className="profile__actions">

                            <button className="profile__edit">
                                Edit Profile
                            </button>

                            <button className="profile__more">
                                ⋯
                            </button>

                        </div>

                    </div>

                </div>

                <div className="profile__bio">

                    <p className="profile__role">
                        Developer • Creator • Student
                    </p>

                    <p>
                        Building things on the internet 🚀
                    </p>

                    <a href="#">
                        🌐 mywebsite.com
                    </a>

                    <p className="profile__joined">
                        📅 Joined August 2024
                    </p>

                </div>


                <div className="profile__stats">

                    <div>
                        <strong>124</strong>
                        <span>Posts</span>
                    </div>

                    <div>
                        <strong>12.5K</strong>
                        <span>Followers</span>
                    </div>

                    <div>
                        <strong>348</strong>
                        <span>Following</span>
                    </div>

                </div>

            </div>


            {/* Tabs */}

            <div className="profile__tabs">

                {tabs.map((tab) => (

                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`profile__tab ${
                            activeTab === tab ? "active" : ""
                        }`}
                    >
                        {tab}
                    </button>

                ))}

            </div>


            {/* Posts */}

            <div className="profile__posts">

                {posts.map((image, index) => (

                    <div
                        className="profile__post"
                        key={index}
                    >

                        <img
                            src={image}
                            alt={`Post ${index + 1}`}
                        />

                    </div>

                ))}

            </div>

        </div>
    );
};

export default Profile;