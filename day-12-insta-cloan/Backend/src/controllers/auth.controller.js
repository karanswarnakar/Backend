import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';
import BlacklistModel from '../models/blacklist.model.js';

const DISCOVERY_SOURCES = [
    "LinkedIn", "Facebook", "Instagram", "X / Twitter", "YouTube",
    "Google / Search", "Friend or colleague", "College / University",
    "GitHub", "Reddit", "Other"
];
const ONBOARDING_GOALS = [
    "Connect with people", "Share posts and ideas", "Follow creators",
    "Discover interesting content", "Build a professional network",
    "Find communities", "Learn new things", "Promote my work",
    "Just exploring", "Other"
];
const ONBOARDING_INTERESTS = [
    "Technology", "Programming", "AI", "Business", "Design", "Gaming",
    "Movies & Entertainment", "Sports", "Education", "Music",
    "Photography", "Travel", "Fashion", "Other"
];
const sessionCookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/"
};

function serializeUser(user) {
    const onboarding = user.onboarding ?? {};
    return {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        isPrivate: user.isPrivate ?? false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        onboarding: {
            completed: onboarding.completed ?? false,
            discoverySource: onboarding.discoverySource ?? "",
            goals: onboarding.goals ?? [],
            interests: onboarding.interests ?? []
        },
        onboardingCompleted: onboarding.completed ?? false
    };
}

async function register(req, res) {
    const { username, email, password, profileImage } = req.body;

    const isUserExist = await UserModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserExist) {
        return res.status(409).json({
            message: `User already exists with username or email`
        })
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
        username,
        email,
        password: hash,
        profileImage
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.cookie("token", token, sessionCookieOptions)

    return res.status(201).json({
        message: 'User created successfully',
        user: serializeUser(user)
    })

}



async function login(req, res) {
    const { username, email, password } = req.body

    const user = await UserModel.findOne({
        $or: [
            { username },
            { email }
        ]
    }).select("+password")

    if (!user) {
        return res.status(404).json({
            message: "User does not exist"
        })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if (!isPasswordMatch) {
        return res.status(409).json({
            message: `Invalid Password`
        })
    }
    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, {"expiresIn": "7d"})

    res.cookie("token", token, sessionCookieOptions)

    res.status(200).json({
        message: "User login successfully",
        user: serializeUser(user)
    })
}


async function getMe(req, res) {
    const userId = req.user.id

    const user = await UserModel.findById({ _id: userId })
    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    return res.status(200).json({
        user: serializeUser(user)
    })

}

async function saveOnboarding(req, res) {
    const { discoverySource, goals, interests } = req.body ?? {};

    const validGoals = Array.isArray(goals)
        && goals.every(goal => ONBOARDING_GOALS.includes(goal));
    const validInterests = Array.isArray(interests)
        && interests.every(interest => ONBOARDING_INTERESTS.includes(interest));
    const validDiscoverySource = typeof discoverySource === "string"
        && (discoverySource === "" || DISCOVERY_SOURCES.includes(discoverySource));

    if (!validDiscoverySource || !validGoals || !validInterests) {
        return res.status(400).json({
            message: "Invalid onboarding response"
        });
    }

    const user = await UserModel.findByIdAndUpdate(
        req.user.id,
        {
            $set: {
                "onboarding.completed": true,
                "onboarding.discoverySource": discoverySource,
                "onboarding.goals": [...new Set(goals)],
                "onboarding.interests": [...new Set(interests)]
            }
        },
        { new: true, runValidators: true }
    );

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
        message: "Onboarding saved successfully",
        user: serializeUser(user)
    });
}

async function logout(req, res) {
    const token = req.cookies.token

    try {
        const blacklist = await BlacklistModel.create({
            token
        })
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/"
        })
        return res.status(200).json({
            massage: "User logout successfully."
        })
    } catch (err) {
        return res.status(400).json({
            message: "User already logout"
        })
    }


}


const authController = {
    register,
    login,
    getMe,
    saveOnboarding,
    logout
}

export default authController;