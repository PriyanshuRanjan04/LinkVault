import { createClient } from "@/lib/supabase/server";
import DashboardClient from "@/components/DashboardClient";
import ThemeToggle from "@/components/ThemeToggle";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    const { data: bookmarks } = await supabase
        .from("bookmarks")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
            {/* ── Navbar ─────────────────────────────────────────── */}
            <nav className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                            LinkVault
                        </h1>

                        <div className="flex items-center gap-4">
                            <span className="hidden sm:inline text-sm text-zinc-500 dark:text-zinc-400">
                                {user.email}
                            </span>
                            <ThemeToggle />
                            <form action="/auth/signout" method="post">
                                <button
                                    type="submit"
                                    className="p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ── Main content ───────────────────────────────────── */}
            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <DashboardClient initialBookmarks={bookmarks || []} />
            </main>
        </div>
    );
}
