"use client";

import { useState, useEffect } from "react";
import { Plus, Sparkles, X } from "lucide-react";
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
    const [customTitle, setCustomTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const { toast } = useToast();

    // AI Suggestions state
    const [titleOptions, setTitleOptions] = useState<string[]>([]);
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const [selectedTitleIndex, setSelectedTitleIndex] = useState<number | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // URL validation
    const isValidUrl = (urlString: string) => {
        try {
            new URL(urlString);
            return urlString.startsWith("http://") || urlString.startsWith("https://");
        } catch {
            return false;
        }
    };

    const isUrlValid = isValidUrl(url);

    // Auto-trigger AI suggestions with debouncing
    useEffect(() => {
        if (!isUrlValid) {
            return;
        }

        const timeoutId = setTimeout(() => {
            // Call handleEnhance directly here instead of depending on it
            if (isEnhancing) return;

            setIsEnhancing(true);
            setShowSuggestions(false);

            fetch("/api/ai-enhance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            })
                .then(res => res.json())
                .then(data => {
                    console.log("AI Response:", data); // Debug log

                    if (data.titleOptions && data.titleOptions.length > 0) {
                        setTitleOptions(data.titleOptions);
                        setSelectedTitleIndex(0);
                        setTitle(data.titleOptions[0]);
                        setShowSuggestions(true);
                    }

                    if (data.summary) setSummary(data.summary);
                    if (data.suggestedTags) setSuggestedTags(data.suggestedTags);

                    toast("✨ AI suggestions ready!", "success");
                })
                .catch(error => {
                    console.error("AI enhancement failed:", error);
                    // Silently fail for auto-trigger
                })
                .finally(() => {
                    setIsEnhancing(false);
                });
        }, 1000); // Debounce for 1 second

        return () => clearTimeout(timeoutId);
    }, [url, isUrlValid]); // Only depend on url and isUrlValid

    const handleEnhance = async () => {
        if (!isUrlValid || isEnhancing) return;
        setIsEnhancing(true);
        setShowSuggestions(false);

        try {
            const response = await fetch("/api/ai-enhance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });
            const data = await response.json();

            if (data.titleOptions && data.titleOptions.length > 0) {
                setTitleOptions(data.titleOptions);
                setSelectedTitleIndex(0); // Auto-select first option
                setTitle(data.titleOptions[0]);
                setShowSuggestions(true);
            }

            if (data.summary) setSummary(data.summary);
            if (data.suggestedTags) setSuggestedTags(data.suggestedTags);

            toast("✨ AI suggestions ready!", "success");
        } catch (error) {
            console.error("AI enhancement failed:", error);
            // Silently fail for auto-trigger, don't show error toast
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleTitleSelection = (index: number) => {
        setSelectedTitleIndex(index);
        if (index === -1) {
            // Custom option selected
            setTitle(customTitle);
        } else {
            setTitle(titleOptions[index]);
        }
    };

    const handleAddTag = (tag: string) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
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
            setCustomTitle("");
            setSummary("");
            setTags([]);
            setTitleOptions([]);
            setSuggestedTags([]);
            setSelectedTitleIndex(null);
            setShowSuggestions(false);
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
            className="mb-8 p-6 bg-zinc-800/80 rounded-xl shadow-lg shadow-purple-500/5 border border-purple-500/30 backdrop-blur-sm"
        >
            <h3 className="text-lg font-medium mb-4 text-zinc-100">
                Add New Bookmark
            </h3>

            <div className="space-y-4">
                {/* URL */}
                <div>
                    <label
                        htmlFor="url"
                        className="block text-sm font-medium text-zinc-300 mb-1"
                    >
                        URL
                    </label>
                    <input
                        id="url"
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-900/50 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-zinc-500"
                        required
                    />
                    {isEnhancing && (
                        <p className="text-xs text-purple-400 mt-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 animate-pulse" />
                            Analyzing URL...
                        </p>
                    )}
                </div>

                {/* Title with AI Suggestions */}
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-zinc-300 mb-1"
                    >
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={isUrlValid ? "AI will suggest titles..." : "Enter URL first"}
                        className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-900/50 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                        disabled={!isUrlValid}
                    />

                    {/* AI Title Suggestions - Inline below Title field */}
                    {showSuggestions && titleOptions.length > 0 && (
                        <div className="mt-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-purple-300 flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3" />
                                    AI Suggestions:
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowSuggestions(false)}
                                    className="text-zinc-400 hover:text-zinc-200"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>

                            <div className="space-y-1.5">
                                {titleOptions.map((option, index) => (
                                    <label
                                        key={index}
                                        className={`flex items-start gap-2 p-2 rounded-md cursor-pointer transition-colors ${selectedTitleIndex === index
                                            ? "bg-purple-500/20 border border-purple-500/40"
                                            : "hover:bg-zinc-700/50 border border-transparent"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="titleOption"
                                            checked={selectedTitleIndex === index}
                                            onChange={() => handleTitleSelection(index)}
                                            className="mt-0.5"
                                        />
                                        <span className="text-xs text-zinc-200">{option}</span>
                                    </label>
                                ))}

                                {/* Custom title option */}
                                <label
                                    className={`flex items-start gap-2 p-2 rounded-md cursor-pointer transition-colors ${selectedTitleIndex === -1
                                        ? "bg-purple-500/20 border border-purple-500/40"
                                        : "hover:bg-zinc-700/50 border border-transparent"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="titleOption"
                                        checked={selectedTitleIndex === -1}
                                        onChange={() => handleTitleSelection(-1)}
                                        className="mt-0.5"
                                    />
                                    <div className="flex-1">
                                        <span className="text-xs text-zinc-200 block mb-1">Custom</span>
                                        <input
                                            type="text"
                                            value={customTitle}
                                            onChange={(e) => {
                                                setCustomTitle(e.target.value);
                                                if (selectedTitleIndex === -1) {
                                                    setTitle(e.target.value);
                                                }
                                            }}
                                            onFocus={() => handleTitleSelection(-1)}
                                            placeholder="Type your own title..."
                                            className="w-full px-2 py-1 text-xs border border-zinc-600 rounded bg-zinc-900/50 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder:text-zinc-500"
                                        />
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div>
                    <label
                        htmlFor="summary"
                        className="block text-sm font-medium text-zinc-300 mb-1"
                    >
                        Summary{" "}
                        <span className="text-zinc-500 text-xs font-normal">
                            (Optional)
                        </span>
                    </label>
                    <textarea
                        id="summary"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder={isUrlValid ? "Brief description..." : "Enter URL first"}
                        rows={2}
                        className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-900/50 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none placeholder:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!isUrlValid}
                    />
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                        Tags{" "}
                        <span className="text-zinc-400 text-xs font-normal">
                            (Optional)
                        </span>
                    </label>

                    {/* Suggested tags */}
                    {suggestedTags.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1.5">
                            <span className="text-xs text-zinc-400 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Suggested:
                            </span>
                            {suggestedTags.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => handleAddTag(tag)}
                                    disabled={tags.includes(tag)}
                                    className={`px-2 py-0.5 rounded text-xs font-medium transition-all active:scale-95 ${tags.includes(tag)
                                        ? "bg-purple-500/20 text-purple-300 cursor-default"
                                        : "bg-zinc-700 text-zinc-300 hover:bg-purple-500/20 hover:text-purple-300"
                                        }`}
                                >
                                    {tags.includes(tag) ? "✓ " : "+ "}{tag}
                                </button>
                            ))}
                        </div>
                    )}

                    <TagInput
                        tags={tags}
                        onChange={setTags}
                        disabled={!isUrlValid}
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting || !isUrlValid}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium active:scale-[0.98] shadow-lg shadow-purple-500/20"
                >
                    <Plus className="w-4 h-4" />
                    {isSubmitting ? "Adding..." : "Add Bookmark"}
                </button>
            </div>
        </form>
    );
}
