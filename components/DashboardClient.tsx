"use client";

import { useState } from "react";
import { Bookmark } from "@/types/custom";
import AddBookmark from "./AddBookmark";
import BookmarkList from "./BookmarkList";

export default function DashboardClient({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks || []);

    const handleBookmarkAdded = (newBookmark: Bookmark) => {
        console.log("✅ Adding bookmark immediately:", newBookmark);
        setBookmarks([newBookmark, ...bookmarks]);
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
