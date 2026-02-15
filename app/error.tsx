"use client";

import { useEffect } from "react";
import { Bookmark } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden isolate px-4 text-center">
            {/* ── Animated gradient background (Same as page.tsx) ── */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-900 via-blue-900 to-zinc-900" />
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-slow" />

            <div className="flex flex-col items-center gap-6 max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
                    <Bookmark className="w-8 h-8 text-white" />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Something went wrong!</h2>
                    <p className="text-zinc-300 text-sm">
                        We encountered an error loading the application.
                    </p>
                </div>

                <button
                    onClick={reset}
                    className="px-6 py-2.5 rounded-lg bg-white text-zinc-900 font-medium hover:bg-zinc-100 transition-colors shadow-lg active:scale-95"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
