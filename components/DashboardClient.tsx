"use client";

import { useState } from "react";
import { Bookmark } from "@/types/custom";
import AddBookmark from "./AddBookmark";
import BookmarkList from "./BookmarkList";

export default function DashboardClient({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks || []);

    const handleBookmarkAdded = (newBookmark: Bookmark) => {
        console.log("DashboardClient: handleBookmarkAdded CALLED", newBookmark);
        setBookmarks((prev) => {
            // Prevent duplicates
            if (prev.some((b) => b.id === newBookmark.id)) {
                console.log("DashboardClient: Duplicate ID blocked", newBookmark.id);
                return prev;
            }
            return [newBookmark, ...prev];
        });
    };

    const handleBookmarkDeleted = (id: string) => {
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
    };

    return (
        <div className="space-y-6">
            {/* DEBUG INFO - remove this after testing */}
            <div className="p-2 text-xs bg-red-100 text-red-800 rounded dark:bg-red-900/20 dark:text-red-200">
                DEBUG: Count = {bookmarks.length} | First ID = {bookmarks[0]?.id?.slice(0, 4)}
            </div>

            <AddBookmark onBookmarkAdded={handleBookmarkAdded} />
            <BookmarkList
                bookmarks={bookmarks}
                onBookmarkDeleted={handleBookmarkDeleted}
            />
        </div>
    );
}
