"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("theme");
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const shouldBeDark = stored === "dark" || (!stored && systemDark);

        setIsDark(shouldBeDark);
        if (shouldBeDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        if (next) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    // Avoid hydration mismatch — render nothing until mounted
    if (!mounted) return <div className="w-14 h-7" />;

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            aria-label="Toggle theme"
        >
            <div
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-zinc-900 shadow-md transform transition-transform duration-300 flex items-center justify-center ${isDark ? "translate-x-7" : "translate-x-0"
                    }`}
            >
                {isDark ? (
                    <Moon className="w-4 h-4 text-purple-400" />
                ) : (
                    <Sun className="w-4 h-4 text-yellow-500" />
                )}
            </div>
        </button>
    );
}
