"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bookmark } from "@/types/custom";
import AddBookmark from "./AddBookmark";
import BookmarkList from "./BookmarkList";

export default function DashboardClient({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks || []);

    useEffect(() => {
        const supabase = createClient();

        // Subscribe to realtime changes
        const channel = supabase
            .channel('bookmarks-changes')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
                    schema: 'public',
                    table: 'bookmarks'
                },
                (payload) => {
                    console.log('Realtime event:', payload);

                    if (payload.eventType === 'INSERT') {
                        const newBookmark = payload.new as Bookmark;
                        setBookmarks((prev) => {
                            // Prevent duplicates
                            if (prev.some((b) => b.id === newBookmark.id)) {
                                return prev;
                            }
                            return [newBookmark, ...prev];
                        });
                    } else if (payload.eventType === 'DELETE') {
                        const deletedId = payload.old.id;
                        setBookmarks((prev) => prev.filter((b) => b.id !== deletedId));
                    }
                }
            )
            .subscribe((status) => {
                console.log('Subscription status:', status);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleBookmarkAdded = (newBookmark: Bookmark) => {
        alert(`DashboardClient callback triggered! Title: ${newBookmark.title}`);
        console.log("DashboardClient: handleBookmarkAdded called");
        setBookmarks((prev) => {
            if (prev.some((b) => b.id === newBookmark.id)) {
                return prev;
            }
            return [newBookmark, ...prev];
        });
    };

    console.log("DashboardClient: Rendering, handleBookmarkAdded is:", typeof handleBookmarkAdded);

    const handleBookmarkDeleted = (id: string) => {
        console.log("handleBookmarkDeleted called with:", id);
        // Optimistic update - remove immediately
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
    };

    return (
        <div className="space-y-6">
            {/* DEBUG INFO */}
            <div className="p-2 text-xs bg-blue-100 text-blue-800 rounded dark:bg-blue-900/20 dark:text-blue-200">
                DEBUG: Bookmarks count = {bookmarks.length}
            </div>

            <AddBookmark onBookmarkAdded={handleBookmarkAdded} />
            <BookmarkList
                bookmarks={bookmarks}
                onBookmarkDeleted={handleBookmarkDeleted}
            />
        </div>
    );
}
