import { useEffect, useState } from "react";
import { ThemeContext } from "./theme.store.js";

function getInitialTheme() {
    try {
        return localStorage.getItem("socially:theme") === "light" ? "light" : "dark";
    } catch (error) {
        console.warn("Could not read the saved theme preference:", error);
        return "dark";
    }
}

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        try {
            localStorage.setItem("socially:theme", theme);
        } catch (error) {
            console.error("Could not save the theme preference:", error);
        }
    }, [theme]);

    const toggleTheme = () => setTheme(current => current === "dark" ? "light" : "dark");

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
