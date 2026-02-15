"use client";

import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Bookmark } from "@/types/custom";

interface AddBookmarkProps {
    onBookmarkAdded: (bookmark: Bookmark) => void;
}

export default function AddBookmark({ onBookmarkAdded }: AddBookmarkProps) {
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); // Replaces isPending
    const [isEnhancing, setIsEnhancing] = useState(false);

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
        } catch (error) {
            console.error("AI enhancement failed:", error);
        } finally {
            setIsEnhancing(false);
        }
    };

    console.log("AddBookmark: Component Rendered");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("AddBookmark: SUBMIT CLICKED", { url, title });

        if (!url || !title) {
            console.log("AddBookmark: Missing URL or Title");
            return;
        }

        setIsSubmitting(true);

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error("User not authenticated");
            }

            const newId = crypto.randomUUID();
            const now = new Date().toISOString();

            const newBookmarkPayload: Bookmark = {
                id: newId,
                title,
                url,
                summary: summary || null,
                user_id: user.id,
                created_at: now
            };

            console.log("AddBookmark: About to call onBookmarkAdded");

            // 1. FIRST: Update UI optimistically
            onBookmarkAdded(newBookmarkPayload);

            console.log("AddBookmark: onBookmarkAdded called successfully");

            // 2. THEN: Insert to database (don't await here if you want fire-and-forget)
            supabase
                .from('bookmarks')
                .insert(newBookmarkPayload)
                .then(({ error }) => {
                    if (error) {
                        console.error("Insert error:", error);
                        // alert("Error syncing bookmark to server. Please refresh.");
                    }
                });

            // 3. Reset form immediately (don't wait for DB)
            setUrl("");
            setTitle("");
            setSummary("");

        } catch (error: any) {
            console.error("Error adding bookmark:", error);
            alert(`Failed to add bookmark: ${error.message || "Unknown error"}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-lg font-medium mb-4 text-zinc-900 dark:text-zinc-100">Add New Bookmark</h3>

            <div className="space-y-4">
                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
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

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
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
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                            <Sparkles className="w-4 h-4" />
                            {isEnhancing ? "Generating..." : "Auto-Generate"}
                        </button>
                    </div>
                </div>

                <div>
                    <label htmlFor="summary" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Summary <span className="text-zinc-400 text-xs font-normal">(Optional)</span>
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

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" />
                    {isSubmitting ? "Adding..." : "Add Bookmark"}
                </button>
            </div>
        </form>
    );
}
