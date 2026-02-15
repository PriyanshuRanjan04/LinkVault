"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
    end: string; // e.g. "10,000+" or "4.9★"
    duration?: number; // ms
}

function parseNumeric(str: string): { num: number; suffix: string; isFloat: boolean } {
    // Extract the leading number and the rest as suffix
    const match = str.match(/^([\d,.]+)(.*)/);
    if (!match) return { num: 0, suffix: str, isFloat: false };
    const raw = match[1].replace(/,/g, "");
    const num = parseFloat(raw);
    const isFloat = raw.includes(".");
    return { num, suffix: match[2], isFloat };
}

function formatNumber(n: number, isFloat: boolean): string {
    if (isFloat) return n.toFixed(1);
    // Add commas
    return Math.floor(n).toLocaleString("en-US");
}

export default function AnimatedCounter({
    end,
    duration = 2000,
}: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const [display, setDisplay] = useState("0");
    const [started, setStarted] = useState(false);
    const { num, suffix, isFloat } = parseNumeric(end);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    setStarted(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;

        const startTime = performance.now();

        const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * num;
            setDisplay(formatNumber(current, isFloat) + suffix);

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
    }, [started, num, suffix, isFloat, duration]);

    return <span ref={ref}>{display}</span>;
}
