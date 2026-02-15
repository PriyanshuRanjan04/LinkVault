"use client";

import { createClient } from "@/lib/supabase/client";

export default function FooterLoginButton() {
    const handleLogin = async () => {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <button
            onClick={handleLogin}
            className="hover:text-white transition-colors text-left"
        >
            Sign In
        </button>
    );
}
