import Link from "next/link";
import { Sparkles, Zap, Shield, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Enhanced",
    description:
      "Auto-generate titles and summaries for your bookmarks using advanced AI.",
    color: "text-purple-400",
  },
  {
    icon: Zap,
    title: "Instant Sync",
    description:
      "Your bookmarks update in real-time across all your devices without refresh.",
    color: "text-yellow-400",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Bank-level security with Row Level Security. Only you can see your bookmarks.",
    color: "text-emerald-400",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* ── Animated gradient background ─────────────────────── */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#1e1b4b] to-[#0f172a]" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-slow" />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-32 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
          LinkVault
        </h1>
        <p className="text-lg md:text-2xl text-zinc-300 max-w-2xl mx-auto mb-10">
          Save, organize, and enhance your bookmarks with AI — all in one beautiful place.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
        >
          Get Started Free
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="w-full max-w-6xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <f.icon className={`w-12 h-12 mb-4 ${f.color}`} />
              <h3 className="text-2xl font-bold mb-3 text-white">{f.title}</h3>
              <p className="text-zinc-300 text-base leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
