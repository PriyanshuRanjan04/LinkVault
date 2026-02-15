import { Bookmark } from "lucide-react";

export default function Loading() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden isolate">
            {/* ── Animated gradient background (Same as page.tsx) ── */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-900 via-blue-900 to-zinc-900" />
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-slow" />

            {/* ── Brand Loader ── */}
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <Bookmark className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    LinkVault
                </h1>
            </div>
        </div>
    );
}
