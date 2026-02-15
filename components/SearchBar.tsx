"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    resultCount: number;
}

export default function SearchBar({ value, onChange, resultCount }: SearchBarProps) {
    return (
        <div className="w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Search bookmarks..."
                    className="w-full pl-10 pr-10 py-2.5 border border-zinc-600 rounded-lg bg-zinc-800 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-zinc-500"
                    aria-label="Search bookmarks"
                />
                {value && (
                    <button
                        onClick={() => onChange("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                        aria-label="Clear search"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
            {value && (
                <p className="mt-1.5 text-xs text-zinc-400">
                    {resultCount} bookmark{resultCount !== 1 ? "s" : ""} matching &ldquo;{value}&rdquo;
                </p>
            )}
        </div>
    );
}
