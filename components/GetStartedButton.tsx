"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GetStartedButton({
    text = "Get Started Free",
    className = "",
}: {
    text?: string;
    className?: string;
}) {
    return (
        <Link
            href="/login"
            className={`inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-2xl ${className}`}
        >
            {text}
            <ArrowRight className="w-5 h-5" />
        </Link>
    );
}
