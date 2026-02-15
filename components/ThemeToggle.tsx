"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>("system");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("theme") as Theme | null;
        const currentTheme = stored || "system";
        setTheme(currentTheme);
        applyTheme(currentTheme);

        // Listen for system theme changes when in system mode
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            if (localStorage.getItem("theme") === "system") {
                applyTheme("system");
            }
        };
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const applyTheme = (newTheme: Theme) => {
        if (newTheme === "system") {
            const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            if (systemDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        } else if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    const cycleTheme = () => {
        const cycle: Theme[] = ["light", "dark", "system"];
        const currentIndex = cycle.indexOf(theme);
        const nextTheme = cycle[(currentIndex + 1) % cycle.length];

        setTheme(nextTheme);
        localStorage.setItem("theme", nextTheme);
        applyTheme(nextTheme);
    };

    // Avoid hydration mismatch
    if (!mounted) return <div className="w-9 h-9" />;

    const getIcon = () => {
        switch (theme) {
            case "light":
                return <Sun className="w-4 h-4 text-yellow-500" />;
            case "dark":
                return <Moon className="w-4 h-4 text-purple-400" />;
            case "system":
                return <Monitor className="w-4 h-4 text-blue-400" />;
        }
    };

    return (
        <button
            onClick={cycleTheme}
            className="w-9 h-9 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700 hover:border-purple-500/50 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900 active:scale-95"
            aria-label={`Current theme: ${theme}. Click to cycle.`}
            title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
        >
            {getIcon()}
        </button>
    );
}
