"use client";

import { useState } from "react";
import { Bookmark } from "@/types/custom";
import AddBookmark from "./AddBookmark";
import BookmarkList from "./BookmarkList";

export default function DashboardClient({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks || []);

    const handleBookmarkAdded = (newBookmark: Bookmark) => {
        console.log("✅ DashboardClient: Adding bookmark", newBookmark);
        // USE FUNCTIONAL UPDATE - this is the fix!
        setBookmarks((prev) => [newBookmark, ...prev]);
    };

    const handleBookmarkDeleted = (id: string) => {
        setBookmarks(bookmarks.filter((b) => b.id !== id));
    };

    return (
        <div className="space-y-6">
            <AddBookmark onBookmarkAdded={handleBookmarkAdded} />
            <BookmarkList
                bookmarks={bookmarks}
                onBookmarkDeleted={handleBookmarkDeleted}
            />
        </div>
    );
}
