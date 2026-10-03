export const DISCOVERY_OPTIONS = [
    { label: "LinkedIn", icon: "💼" },
    { label: "Facebook", icon: "👥" },
    { label: "Instagram", icon: "📸" },
    { label: "X / Twitter", icon: "𝕏" },
    { label: "YouTube", icon: "▶️" },
    { label: "Google / Search", icon: "⌕" },
    { label: "Friend or colleague", icon: "🤝" },
    { label: "College / University", icon: "🎓" },
    { label: "GitHub", icon: "⌘" },
    { label: "Reddit", icon: "💬" },
    { label: "Other", icon: "✦" }
];

export const GOAL_OPTIONS = [
    { label: "Connect with people", icon: "🤝" },
    { label: "Share posts and ideas", icon: "✍️" },
    { label: "Follow creators", icon: "⭐" },
    { label: "Discover interesting content", icon: "🔎" },
    { label: "Build a professional network", icon: "🌐" },
    { label: "Find communities", icon: "🫂" },
    { label: "Learn new things", icon: "📚" },
    { label: "Promote my work", icon: "🚀" },
    { label: "Just exploring", icon: "🧭" },
    { label: "Other", icon: "✦" }
];

export const INTEREST_OPTIONS = [
    { label: "Technology", icon: "💻" },
    { label: "Programming", icon: "⌨️" },
    { label: "AI", icon: "🤖" },
    { label: "Business", icon: "📈" },
    { label: "Design", icon: "🎨" },
    { label: "Gaming", icon: "🎮" },
    { label: "Movies & Entertainment", icon: "🎬" },
    { label: "Sports", icon: "⚽" },
    { label: "Education", icon: "🎓" },
    { label: "Music", icon: "🎵" },
    { label: "Photography", icon: "📷" },
    { label: "Travel", icon: "✈️" },
    { label: "Fashion", icon: "👟" },
    { label: "Other", icon: "✦" }
];

export const ONBOARDING_STEPS = [
    {
        title: "How did you discover Socially?",
        subtitle: "Help us understand what brought you here.",
        options: DISCOVERY_OPTIONS,
        field: "discoverySource",
        multiple: false
    },
    {
        title: "What brings you to Socially?",
        subtitle: "Choose what you want to get out of your experience.",
        options: GOAL_OPTIONS,
        field: "goals",
        multiple: true
    },
    {
        title: "What would you like to see on your feed?",
        subtitle: "Pick the topics you're interested in.",
        options: INTEREST_OPTIONS,
        field: "interests",
        multiple: true
    }
];
