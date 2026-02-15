"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Shield, Loader2 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error("Error logging in:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
            {/* ── Animated gradient background (matches landing page) ── */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-900 via-blue-900 to-zinc-900" />
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-slow" />

            {/* ── Back to Home ──────────────────────────────────── */}
            <Link
                href="/"
                className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm transition-all active:scale-95"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Home</span>
            </Link>

            {/* ── Centered content ──────────────────────────────── */}
            <ScrollReveal>
                {/* Logo */}
                <div className="w-14 h-14 md:w-16 md:h-16 mb-8 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Bookmark className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>

                {/* Glass card */}
                <div className="w-full max-w-md p-6 sm:p-8 md:p-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 hover:border-white/30 transition-all duration-300">
                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Welcome to LinkVault
                    </h1>

                    {/* Subtitle */}
                    <p className="text-sm sm:text-base text-zinc-300 text-center max-w-sm mx-auto mb-8 leading-relaxed">
                        Sign in to access your personal bookmark vault
                    </p>

                    {/* Google Sign-In Button */}
                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        aria-label="Sign in with Google"
                        className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-lg text-zinc-900 dark:text-zinc-100 font-semibold text-base hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Signing in…</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span>Sign in with Google</span>
                            </>
                        )}
                    </button>

                    {/* Security badge */}
                    <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-zinc-400">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Secure OAuth login</span>
                    </div>
                </div>

                {/* Footer links */}
                <div className="flex items-center justify-center gap-4 mt-8 text-sm text-zinc-500">
                    <span className="hover:text-zinc-200 transition-colors cursor-default">
                        Privacy
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className="hover:text-zinc-200 transition-colors cursor-default">
                        Terms
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className="hover:text-zinc-200 transition-colors cursor-default">
                        Help
                    </span>
                </div>
            </ScrollReveal>
        </div>
    );
}
