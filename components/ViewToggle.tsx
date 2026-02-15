"use client";

import { useState, useEffect } from "react";
import { LayoutGrid, List } from "lucide-react";
import { ViewMode } from "@/types/custom";

interface ViewToggleProps {
    value: ViewMode;
    onChange: (value: ViewMode) => void;
}

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    // Hydration-safe: load saved preference on mount
    useEffect(() => {
        const saved = localStorage.getItem("viewMode") as ViewMode | null;
        if (saved && (saved === "grid" || saved === "list")) {
            onChange(saved);
        }
    }, []);

    const toggle = (mode: ViewMode) => {
        onChange(mode);
        localStorage.setItem("viewMode", mode);
    };

    if (!mounted) return <div className="w-[76px] h-[38px]" />;

    const btn = (mode: ViewMode, Icon: typeof LayoutGrid) => (
        <button
            onClick={() => toggle(mode)}
            className={`p-2 rounded-lg transition-colors ${value === mode
                    ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                }`}
            aria-label={`${mode} view`}
            aria-pressed={value === mode}
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    return (
        <div className="flex items-center gap-1 border border-zinc-300 dark:border-zinc-600 rounded-lg p-0.5">
            {btn("grid", LayoutGrid)}
            {btn("list", List)}
        </div>
    );
}
