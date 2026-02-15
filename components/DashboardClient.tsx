"use client";

import { useState } from "react";
import { Bookmark } from "@/types/custom";
import AddBookmark from "./AddBookmark";
import BookmarkList from "./BookmarkList";

export default function DashboardClient({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks || []);

    const handleBookmarkAdded = (newBookmark: Bookmark) => {
        setBookmarks((prev) => [newBookmark, ...prev]);
    };

    const handleBookmarkDeleted = (id: string) => {
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
    };

    return (
        <div className="space-y-8">
            <AddBookmark onBookmarkAdded={handleBookmarkAdded} />
            <BookmarkList
                bookmarks={bookmarks}
                onBookmarkDeleted={handleBookmarkDeleted}
            />
        </div>
    );
}