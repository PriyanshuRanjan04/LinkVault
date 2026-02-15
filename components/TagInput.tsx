"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
}

const SUGGESTIONS = [
    "work",
    "personal",
    "tutorial",
    "article",
    "video",
    "tool",
    "reference",
    "design",
    "dev",
    "ai",
];

export default function TagInput({ tags, onChange }: TagInputProps) {
    const [input, setInput] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const addTag = (tag: string) => {
        const cleaned = tag.trim().toLowerCase();
        if (cleaned && !tags.includes(cleaned)) {
            onChange([...tags, cleaned]);
        }
        setInput("");
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter((t) => t !== tagToRemove));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && input.trim()) {
            e.preventDefault();
            addTag(input);
        }
        if (e.key === "Backspace" && !input && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    const filteredSuggestions = SUGGESTIONS.filter(
        (s) => s.includes(input.toLowerCase()) && !tags.includes(s)
    );

    return (
        <div className="relative">
            <div className="flex flex-wrap items-center gap-1.5 p-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-transparent min-h-[42px] focus-within:ring-2 focus-within:ring-blue-500">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-xs font-medium"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-blue-900 dark:hover:text-blue-100"
                            aria-label={`Remove ${tag} tag`}
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? "Add tags..." : ""}
                    className="flex-1 min-w-[80px] bg-transparent text-sm text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-400"
                />
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && input && filteredSuggestions.length > 0 && (
                <div className="absolute z-20 mt-1 w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg max-h-36 overflow-y-auto">
                    {filteredSuggestions.map((s) => (
                        <button
                            key={s}
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                addTag(s);
                            }}
                            className="w-full text-left px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
