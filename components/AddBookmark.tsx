"use client";

import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Bookmark } from "@/types/custom";
import TagInput from "./TagInput";
import { useToast } from "./Toast";

interface AddBookmarkProps {
    onBookmarkAdded: (bookmark: Bookmark) => void;
}

export default function AddBookmark({ onBookmarkAdded }: AddBookmarkProps) {
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const { toast } = useToast();

    const handleEnhance = async () => {
        if (!url) return;
        setIsEnhancing(true);
        try {
            const response = await fetch("/api/ai-enhance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });
            const data = await response.json();
            if (data.title) setTitle(data.title);
            if (data.summary) setSummary(data.summary);
            toast("AI enhancement applied!", "success");
        } catch (error) {
            console.error("AI enhancement failed:", error);
            toast("AI enhancement failed. Try again.", "error");
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!url || !title) {
            toast("Please enter both URL and title", "error");
            return;
        }

        setIsSubmitting(true);

        try {
            const supabase = createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                throw new Error("User not authenticated");
            }

            const newBookmark: Bookmark = {
                id: crypto.randomUUID(),
                title,
                url,
                summary: summary || null,
                is_favorite: false,
                tags,
                user_id: user.id,
                created_at: new Date().toISOString(),
            };

            // Update UI immediately
            onBookmarkAdded(newBookmark);

            // Save to database
            const { error } = await supabase.from("bookmarks").insert(newBookmark);

            if (error) {
                console.error("Database error:", error);
                toast("Failed to save bookmark", "error");
                return;
            }

            toast("Bookmark added successfully!", "success");

            // Clear form
            setUrl("");
            setTitle("");
            setSummary("");
            setTags([]);
        } catch (error: any) {
            console.error("Error:", error);
            toast(`Failed: ${error.message}`, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-8 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700"
        >
            <h3 className="text-lg font-medium mb-4 text-zinc-900 dark:text-zinc-100">
                Add New Bookmark
            </h3>

            <div className="space-y-4">
                {/* URL */}
                <div>
                    <label
                        htmlFor="url"
                        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                        URL
                    </label>
                    <input
                        id="url"
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Title + AI button */}
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                        Title
                    </label>
                    <div className="flex gap-2">
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Bookmark Title"
                            className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={handleEnhance}
                            disabled={isEnhancing || !url}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors disabled:opacity-50 whitespace-nowrap active:scale-95"
                        >
                            <Sparkles className="w-4 h-4" />
                            {isEnhancing ? "Generating..." : "Auto-Generate"}
                        </button>
                    </div>
                </div>

                {/* Summary */}
                <div>
                    <label
                        htmlFor="summary"
                        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                        Summary{" "}
                        <span className="text-zinc-400 text-xs font-normal">
                            (Optional)
                        </span>
                    </label>
                    <textarea
                        id="summary"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Brief description..."
                        rows={2}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Tags{" "}
                        <span className="text-zinc-400 text-xs font-normal">
                            (Optional)
                        </span>
                    </label>
                    <TagInput tags={tags} onChange={setTags} />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium active:scale-[0.98]"
                >
                    <Plus className="w-4 h-4" />
                    {isSubmitting ? "Adding..." : "Add Bookmark"}
                </button>
            </div>
        </form>
    );
}
