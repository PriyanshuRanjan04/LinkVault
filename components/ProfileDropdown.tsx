"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";

interface ProfileDropdownProps {
    email: string;
}

export default function ProfileDropdown({ email }: ProfileDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-zinc-400 hover:text-purple-400 rounded-lg hover:bg-purple-500/10 transition-colors"
                aria-label="Profile menu"
            >
                <User className="w-4 h-4" />
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg shadow-purple-500/5 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-zinc-700">
                        <p className="text-xs text-zinc-500 mb-1">Signed in as</p>
                        <p className="text-sm text-zinc-100 truncate">{email}</p>
                    </div>
                    <form action="/auth/signout" method="post">
                        <button
                            type="submit"
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
