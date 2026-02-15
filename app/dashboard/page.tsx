import { createClient } from "@/lib/supabase/server";
import DashboardClient from "@/components/DashboardClient";
import ThemeToggle from "@/components/ThemeToggle";
import ProfileDropdown from "@/components/ProfileDropdown";
import { redirect } from "next/navigation";
import { Bookmark } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/");
    }

    const { data: bookmarks } = await supabase
        .from("bookmarks")
        .select("*")
        .order("created_at", { ascending: false });

    const bookmarkCount = bookmarks?.length || 0;

    return (
        <div className="min-h-screen bg-zinc-900">
            {/* ── Enhanced Navbar ──────────────────────────────── */}
            <nav className="sticky top-0 z-30 bg-gradient-to-r from-zinc-900 via-purple-900/20 to-zinc-900 backdrop-blur-lg border-b border-purple-500/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-4">
                        {/* Left: Logo + Stats */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                    <Bookmark className="w-4 h-4 text-white" />
                                </div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                                    LinkVault
                                </h1>
                            </div>
                            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                <span className="text-xs font-medium text-purple-400">
                                    {bookmarkCount}
                                </span>
                                <span className="text-xs text-zinc-400">
                                    bookmark{bookmarkCount !== 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <ProfileDropdown email={user.email || ""} />
                        </div>
                    </div>
                </div>
            </nav>

            {/* ── Main content ─────────────────────────────────── */}
            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <DashboardClient initialBookmarks={bookmarks || []} />
            </main>
        </div>
    );
}
