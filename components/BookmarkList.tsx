"use client";

import { useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bookmark, ViewMode } from "@/types/custom";
import { Trash2, ExternalLink, Bookmark as BookmarkIcon, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface BookmarkListProps {
    bookmarks: Bookmark[];
    onBookmarkDeleted: (id: string) => void;
    onBookmarkUpdated: (updated: Bookmark) => void;
    viewMode: ViewMode;
}

const getFaviconUrl = (url: string) => {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
        return null;
    }
};

function FaviconImage({ url }: { url: string }) {
    const faviconSrc = getFaviconUrl(url);
    let initial = "?";
    try {
        initial = new URL(url).hostname[0].toUpperCase();
    } catch {
        /* keep fallback */
    }

    if (!faviconSrc) {
        return (
            <div className="w-6 h-6 shrink-0 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs text-white font-bold">
                {initial}
            </div>
        );
    }

    return (
        <img
            src={faviconSrc}
            alt=""
            className="w-6 h-6 shrink-0 rounded"
            onError={(e) => {
                const el = e.currentTarget;
                const fallback = document.createElement("div");
                fallback.className =
                    "w-6 h-6 shrink-0 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs text-white font-bold";
                fallback.textContent = initial;
                el.replaceWith(fallback);
            }}
        />
    );
}

export default function BookmarkList({
    bookmarks,
    onBookmarkDeleted,
    onBookmarkUpdated,
    viewMode,
}: BookmarkListProps) {
    const supabase = useMemo(() => createClient(), []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this bookmark?")) return;
        onBookmarkDeleted(id);

        const { error } = await supabase.from("bookmarks").delete().eq("id", id);
        if (error) {
            console.error("Error deleting bookmark:", error);
            alert("Failed to delete bookmark. Please refresh the page.");
        }
    };

    const handleToggleFavorite = async (bookmark: Bookmark) => {
        const updated = { ...bookmark, is_favorite: !bookmark.is_favorite };
        // Optimistic update
        onBookmarkUpdated(updated);

        const { error } = await supabase
            .from("bookmarks")
            .update({ is_favorite: updated.is_favorite })
            .eq("id", bookmark.id);

        if (error) {
            console.error("Error updating favorite:", error);
            // Revert
            onBookmarkUpdated(bookmark);
        }
    };

    /* ── Empty state ─────────────────────────────────────── */
    if (bookmarks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 mb-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <BookmarkIcon className="w-12 h-12 text-zinc-400" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                    No bookmarks yet
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm">
                    Start building your digital library by adding your first bookmark above!
                </p>
            </div>
        );
    }

    /* ── List view ───────────────────────────────────────── */
    if (viewMode === "list") {
        return (
            <div className="flex flex-col gap-3">
                {bookmarks.map((bookmark) => (
                    <div
                        key={bookmark.id}
                        className="group flex items-center gap-4 p-4 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
                    >
                        <FaviconImage url={bookmark.url} />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                    {bookmark.title}
                                </h3>
                                {bookmark.tags?.length > 0 && (
                                    <div className="hidden sm:flex items-center gap-1">
                                        {bookmark.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-[10px] font-medium"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                                <a
                                    href={bookmark.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 truncate"
                                >
                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                    {new URL(bookmark.url).hostname}
                                </a>
                                <span className="text-[10px] text-zinc-400 shrink-0">
                                    {formatDistanceToNow(new Date(bookmark.created_at), {
                                        addSuffix: true,
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                onClick={() => handleToggleFavorite(bookmark)}
                                className="p-2 rounded-full transition-colors"
                                title={bookmark.is_favorite ? "Unfavorite" : "Favorite"}
                            >
                                <Star
                                    className={`w-4 h-4 ${bookmark.is_favorite
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-zinc-400 hover:text-yellow-400"
                                        }`}
                                />
                            </button>
                            <button
                                onClick={() => handleDelete(bookmark.id)}
                                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                title="Delete Bookmark"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    /* ── Grid view (default) ─────────────────────────────── */
    return (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => (
                <div
                    key={bookmark.id}
                    className="group relative flex flex-col p-6 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02]"
                >
                    {/* Star button — top right */}
                    <button
                        onClick={() => handleToggleFavorite(bookmark)}
                        className="absolute top-4 right-4 p-1 rounded-full transition-colors"
                        title={bookmark.is_favorite ? "Unfavorite" : "Favorite"}
                    >
                        <Star
                            className={`w-5 h-5 ${bookmark.is_favorite
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-zinc-300 hover:text-yellow-400"
                                }`}
                        />
                    </button>

                    {/* Header — favicon + title */}
                    <div className="flex items-start gap-3 mb-2 pr-8">
                        <FaviconImage url={bookmark.url} />
                        <h3
                            className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 line-clamp-2 flex-1"
                            title={bookmark.title}
                        >
                            {bookmark.title}
                        </h3>
                    </div>

                    {/* URL */}
                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-3"
                    >
                        <ExternalLink className="w-3 h-3" />
                        {new URL(bookmark.url).hostname}
                    </a>

                    {/* Summary */}
                    {bookmark.summary && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-3 flex-1">
                            {bookmark.summary}
                        </p>
                    )}

                    {/* Tags */}
                    {bookmark.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {bookmark.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-xs font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Footer — timestamp + delete */}
                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-zinc-100 dark:border-zinc-700">
                        <span className="text-xs text-zinc-400">
                            {formatDistanceToNow(new Date(bookmark.created_at), {
                                addSuffix: true,
                            })}
                        </span>
                        <button
                            onClick={() => handleDelete(bookmark.id)}
                            className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                            title="Delete Bookmark"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
