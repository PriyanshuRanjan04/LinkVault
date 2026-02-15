"use client";

import { ArrowUpDown } from "lucide-react";
import { SortOption } from "@/types/custom";

interface SortDropdownProps {
    value: SortOption;
    onChange: (value: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
    { value: "date-desc", label: "Newest First" },
    { value: "date-asc", label: "Oldest First" },
    { value: "title-asc", label: "Title A → Z" },
    { value: "title-desc", label: "Title Z → A" },
    { value: "url-asc", label: "URL A → Z" },
    { value: "url-desc", label: "URL Z → A" },
];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
    return (
        <div className="relative flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-zinc-400 shrink-0" />
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as SortOption)}
                className="appearance-none bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 py-2.5 pr-8 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                aria-label="Sort bookmarks"
            >
                {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
