"use client";

import { useState } from "react";
import { Bookmark } from "@/types/custom";
import AddBookmark from "./AddBookmark";
import BookmarkList from "./BookmarkList";

export default function DashboardClient({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks || []);

    // TEST FUNCTION
    const testAddBookmark = () => {
        alert("Test button clicked!");
        const testBookmark: Bookmark = {
            id: "test-" + Date.now(),
            title: "TEST BOOKMARK " + Date.now(),
            url: "https://test.com",
            summary: null,
            user_id: "test-user",
            created_at: new Date().toISOString()
        };
        console.log("TEST: Adding test bookmark", testBookmark);
        setBookmarks((prev) => {
            console.log("TEST: Previous bookmarks:", prev.length);
            const updated = [testBookmark, ...prev];
            console.log("TEST: New bookmarks:", updated.length);
            return updated;
        });
    };

    const handleBookmarkAdded = (newBookmark: Bookmark) => {
        console.log("✅ DashboardClient: handleBookmarkAdded called", newBookmark);
        setBookmarks((prev) => {
            console.log("✅ Previous count:", prev.length);
            const updated = [newBookmark, ...prev];
            console.log("✅ New count:", updated.length);
            return updated;
        });
    };

    const handleBookmarkDeleted = (id: string) => {
        console.log("✅ DashboardClient: Deleting bookmark", id);
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
    };

    return (
        <div className="space-y-6">
            {/* DEBUG INFO */}
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded">
                <p className="text-sm">Bookmarks in state: {bookmarks.length}</p>
                <button
                    onClick={testAddBookmark}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    🧪 TEST: Add Fake Bookmark (bypasses form)
                </button>
            </div>

            <AddBookmark onBookmarkAdded={handleBookmarkAdded} />
            <BookmarkList
                bookmarks={bookmarks}
                onBookmarkDeleted={handleBookmarkDeleted}
            />
        </div>
    );
}
