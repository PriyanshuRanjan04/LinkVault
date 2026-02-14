"use client";

import { createClient } from "@/lib/supabase/client";
import { Bookmark } from "@/types/custom";
import { Trash2, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteBookmark } from "@/app/actions";

export default function BookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
    const supabase = useMemo(() => createClient(), []);
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Sync state with props when revalidatePath updates the server component
    useEffect(() => {
        setBookmarks(initialBookmarks);
    }, [initialBookmarks]);

    useEffect(() => {
        // Set up Realtime subscription
        const channel = supabase
            .channel("realtime-bookmarks")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bookmarks",
                },
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        setBookmarks((prev) => {
                            if (prev.find(b => b.id === payload.new.id)) return prev;
                            return [payload.new as Bookmark, ...prev];
                        });
                    } else if (payload.eventType === "DELETE") {
                        setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
                    } else if (payload.eventType === "UPDATE") {
                        setBookmarks((prev) =>
                            prev.map((b) => (b.id === payload.new.id ? (payload.new as Bookmark) : b))
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const handleDelete = (id: string) => {
        if (!confirm("Are you sure you want to delete this bookmark?")) return;

        // Optimistic update
        setBookmarks((prev) => prev.filter((b) => b.id !== id));

        startTransition(async () => {
            const result = await deleteBookmark(id);

            if (result?.error) {
                console.error("Error deleting bookmark:", result.error);
                alert("Failed to delete bookmark");
                // Revert on error
                setBookmarks(initialBookmarks);
            } else {
                router.refresh();
            }
        });
    };

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-700">
                <p>No bookmarks yet. Add one above!</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => (
                <div
                    key={bookmark.id}
                    className="group relative flex flex-col p-5 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-shadow"
                >
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 line-clamp-1 mb-1" title={bookmark.title}>
                            {bookmark.title}
                        </h3>
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-2 break-all"
                        >
                            {new URL(bookmark.url).hostname}
                            <ExternalLink className="w-3 h-3" />
                        </a>
                        {bookmark.summary && (
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                                {bookmark.summary}
                            </p>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-700 flex justify-end">
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
