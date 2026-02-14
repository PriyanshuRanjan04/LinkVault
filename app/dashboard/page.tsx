import { createClient } from "@/lib/supabase/server";
import DashboardClient from "@/components/DashboardClient";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";

export const dynamic = 'force-dynamic'

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
            <nav className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">LinkVault</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                {user.email}
                            </span>
                            <form action="/auth/signout" method="post">
                                <button
                                    type="submit"
                                    className="p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <DashboardClient initialBookmarks={bookmarks || []} />

                {/* Diagnostic Overlay */}
                <div className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded text-xs font-mono">
                    <p className="font-bold text-yellow-800 dark:text-yellow-200">SERVER DIAGNOSTICS</p>
                    <p>Render Time: {new Date().toISOString()}</p>
                    <p>Bookmark Count: {bookmarks?.length || 0}</p>
                    <details>
                        <summary className="cursor-pointer text-yellow-600 dark:text-yellow-400">Raw Data Dump</summary>
                        <pre className="mt-2 overflow-x-auto p-2 bg-white dark:bg-black rounded border border-yellow-200 dark:border-yellow-800">
                            {JSON.stringify(bookmarks, null, 2)}
                        </pre>
                    </details>
                </div>
            </main>
        </div>
    );
}

