"use client";
// Vercel Update - Dashboard Client

import { useState, useMemo } from "react";
import { Bookmark, SortOption, ViewMode } from "@/types/custom";
import AddBookmark from "./AddBookmark";
import BookmarkList from "./BookmarkList";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";
import ViewToggle from "./ViewToggle";
import { ToastProvider } from "./Toast";

export default function DashboardClient({
    initialBookmarks,
}: {
    initialBookmarks: Bookmark[];
}) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks || []);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<SortOption>("date-desc");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [activeTag, setActiveTag] = useState<string | null>(null);

    /* ── Handlers ────────────────────────────────────────── */
    const handleBookmarkAdded = (newBookmark: Bookmark) => {
        setBookmarks((prev) => [newBookmark, ...prev]);
    };

    const handleBookmarkDeleted = (id: string) => {
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
    };

    const handleBookmarkUpdated = (updated: Bookmark) => {
        setBookmarks((prev) =>
            prev.map((b) => (b.id === updated.id ? updated : b))
        );
    };

    /* ── All unique tags ─────────────────────────────────── */
    const allTags = useMemo(() => {
        const set = new Set<string>();
        bookmarks.forEach((b) => b.tags?.forEach((t) => set.add(t)));
        return Array.from(set).sort();
    }, [bookmarks]);

    /* ── Filtered + sorted bookmarks ─────────────────────── */
    const processedBookmarks = useMemo(() => {
        let result = [...bookmarks];

        // Search filter
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (b) =>
                    b.title.toLowerCase().includes(q) ||
                    b.url.toLowerCase().includes(q) ||
                    (b.summary && b.summary.toLowerCase().includes(q)) ||
                    b.tags?.some((t) => t.toLowerCase().includes(q))
            );
        }

        // Tag filter
        if (activeTag) {
            result = result.filter((b) => b.tags?.includes(activeTag));
        }

        // Sort
        result.sort((a, b) => {
            switch (sort) {
                case "date-desc":
                    return (
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    );
                case "date-asc":
                    return (
                        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                    );
                case "title-asc":
                    return a.title.localeCompare(b.title);
                case "title-desc":
                    return b.title.localeCompare(a.title);
                case "url-asc":
                    return a.url.localeCompare(b.url);
                case "url-desc":
                    return b.url.localeCompare(a.url);
                default:
                    return 0;
            }
        });

        return result;
    }, [bookmarks, search, sort, activeTag]);

    return (
        <ToastProvider>
            <div className="space-y-6">
                <AddBookmark onBookmarkAdded={handleBookmarkAdded} />

                {/* ── Toolbar: Search + Sort + View ────────────────── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        resultCount={processedBookmarks.length}
                    />
                    <div className="flex items-center gap-3 ml-auto">
                        <SortDropdown value={sort} onChange={setSort} />
                        <ViewToggle value={viewMode} onChange={setViewMode} />
                    </div>
                </div>

                {/* ── Tag filters ──────────────────────────────────── */}
                {allTags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => setActiveTag(null)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors active:scale-95 ${activeTag === null
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                                }`}
                        >
                            All
                        </button>
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors active:scale-95 ${activeTag === tag
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Bookmark list ────────────────────────────────── */}
                <BookmarkList
                    bookmarks={processedBookmarks}
                    onBookmarkDeleted={handleBookmarkDeleted}
                    onBookmarkUpdated={handleBookmarkUpdated}
                    viewMode={viewMode}
                />
            </div>
        </ToastProvider>
    );
}