import mongoose from 'mongoose';

const onboardingSchema = new mongoose.Schema({
    completed: {
        type: Boolean,
        default: false
    },
    discoverySource: {
        type: String,
        default: ""
    },
    goals: {
        type: [String],
        default: []
    },
    interests: {
        type: [String],
        default: []
    }
}, {
    _id: false
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    profileImage: {
        type: String,
        default: "https://ik.imagekit.io/a2vhcigch/default-dp.png"
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    onboarding: {
        type: onboardingSchema,
        default: () => ({})
    }
}, {
    timestamps: true,
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;