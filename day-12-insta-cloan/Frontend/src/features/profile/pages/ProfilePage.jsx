import React from "react";
import "../style/profile.scss";
import { useProfile } from "../hooks/useProfile";

const Profile = () => {
    const {profile} = useProfile()
    



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
                            alt="profile"
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
                                Edit profile
                            </button>

                            <button className="profile__more">
                                ⋯
                            </button>
                        </div>
                    </div>
                </div>

                <div className="profile__bio">
                    <p>Developer • Creator • Student</p>

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

            <div className="profile__tabs">
                {tabs.map((tab, index) => (
                    <button
                        key={tab}
                        className={
                            index === 0
                                ? "profile__tab active"
                                : "profile__tab"
                        }
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="profile__posts">
                {posts.map((image, index) => (
                    <div
                        className="profile__post"
                        key={index}
                    >
                        <img
                            src={image}
                            alt="post"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;