"use client";

import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

export default function GetStartedButton({
    text = "Get Started Free",
    className = "",
}: {
    text?: string;
    className?: string;
}) {
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
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                </>
            ) : (
                <>
                    {text}
                    <ArrowRight className="w-5 h-5" />
                </>
            )}
        </button>
    );
}
