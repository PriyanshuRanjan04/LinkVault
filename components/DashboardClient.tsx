"use client";

import { useState } from "react";
import { Bookmark } from "@/types/custom";
import AddBookmark from "./AddBookmark";
import BookmarkList from "./BookmarkList";

export default function DashboardClient({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks || []);
    const [debugLogs, setDebugLogs] = useState<string[]>([]);

    const addLog = (msg: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setDebugLogs((prev) => [`[${timestamp}] ${msg}`, ...prev]);
    };

    const handleBookmarkAdded = (newBookmark: Bookmark) => {
        addLog(`Bookmark added to state: ${newBookmark.id}`);
        setBookmarks((prev) => [newBookmark, ...prev]);
    };

    const handleBookmarkDeleted = (id: string) => {
        addLog(`Bookmark deleted from state: ${id}`);
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
    };

    return (
        <div className="space-y-6">
            <AddBookmark onBookmarkAdded={handleBookmarkAdded} onLog={addLog} />

            <BookmarkList
                bookmarks={bookmarks}
                onBookmarkDeleted={handleBookmarkDeleted}
            />

            {/* Debug Console */}
            <div className="fixed bottom-4 right-4 z-50 w-full max-w-md">
                <details className="bg-black/80 text-green-400 p-2 rounded-md shadow-lg border border-green-900 backdrop-blur-sm open:bg-black/90">
                    <summary className="cursor-pointer font-mono text-xs font-bold select-none hover:text-green-300">
                        DEBUG LOGS ({debugLogs.length})
                    </summary>
                    <div className="mt-2 max-h-60 overflow-y-auto font-mono text-xs space-y-1 p-2 bg-black/50 rounded">
                        {debugLogs.length === 0 ? (
                            <div className="text-zinc-500 italic">No logs yet...</div>
                        ) : (
                            debugLogs.map((log, i) => (
                                <div key={i} className="border-b border-green-900/30 pb-0.5 last:border-0">
                                    {log}
                                </div>
                            ))
                        )}
                        <button
                            onClick={() => setDebugLogs([])}
                            className="mt-2 w-full text-center text-[10px] text-zinc-500 hover:text-zinc-300 border-t border-zinc-800 pt-1"
                        >
                            CLEAR LOGS
                        </button>
                    </div>
                </details>
            </div>
        </div>
    );
}
