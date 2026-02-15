"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bookmark } from "@/types/custom";
import AddBookmark from "./AddBookmark";
import BookmarkList from "./BookmarkList";

export default function DashboardClient({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks || []);
    const supabase = useMemo(() => createClient(), []);

    // Sync state with props when server data changes
    // useEffect(() => {
    //     console.log("DashboardClient: Syncing from props", initialBookmarks?.length);
    //     setBookmarks(initialBookmarks || []);
    // }, [initialBookmarks]);

    // Realtime subscription for Multi-Tab Sync
    useEffect(() => {
        const channel = supabase
            .channel('realtime-bookmarks')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'bookmarks' },
                (payload) => {
                    const newBookmark = payload.new as Bookmark;
                    setBookmarks((prev) => {
                        // Prevent duplicates (if optimistic update already added it)
                        if (prev.some((b) => b.id === newBookmark.id)) return prev;
                        return [newBookmark, ...prev];
                    });
                }
            )
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'bookmarks' },
                (payload) => {
                    const deletedId = payload.old.id;
                    setBookmarks((prev) => prev.filter((b) => b.id !== deletedId));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const handleBookmarkAdded = (newBookmark: Bookmark) => {
        console.log("DashboardClient: handleBookmarkAdded CALLED", newBookmark);
        // Optimistic update for current tab
        setBookmarks((prev) => {
            console.log("DashboardClient: Previous bookmarks count", prev.length);
            if (prev.some((b) => b.id === newBookmark.id)) {
                console.log("DashboardClient: Duplicate ID blocked", newBookmark.id);
                return prev;
            }
            const updated = [newBookmark, ...prev];
            console.log("DashboardClient: New bookmarks count", updated.length);
            return updated;
        });
    };

    const handleBookmarkDeleted = (id: string) => {
        // Optimistic update for current tab
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
    };

    return (
        <div className="space-y-6">
            {/* DEBUG INFO */}
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
