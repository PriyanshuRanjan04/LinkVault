import Link from "next/link";
import {
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  UserPlus,
  BookmarkPlus,
  Wand2,
  Check,
  X,
  ChevronDown,
  Github,
  Twitter,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/* ── Static data ───────────────────────────────────────── */

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

const stats = [
  { value: "10,000+", label: "Users" },
  { value: "5M+", label: "Bookmarks Saved" },
  { value: "4.9★", label: "Avg Rating" },
];

const steps = [
  {
    icon: UserPlus,
    step: "1",
    title: "Sign in with Google",
    description: "One-click login — no passwords to remember.",
  },
  {
    icon: BookmarkPlus,
    step: "2",
    title: "Add Bookmarks",
    description: "Paste a URL and save it instantly.",
  },
  {
    icon: Wand2,
    step: "3",
    title: "Organize with AI",
    description: "Auto-generate titles, summaries, and tags.",
  },
];

const comparison: { feature: string; linkVault: boolean; browser: boolean }[] = [
  { feature: "AI-generated summaries", linkVault: true, browser: false },
  { feature: "Search & tags", linkVault: true, browser: false },
  { feature: "Cross-device sync", linkVault: true, browser: false },
  { feature: "Favorites & sorting", linkVault: true, browser: false },
  { feature: "Real-time updates", linkVault: true, browser: false },
];

const faqs = [
  {
    q: "Is it free?",
    a: "Yes! LinkVault is completely free to use with all core features included.",
  },
  {
    q: "How secure is my data?",
    a: "We use bank-level encryption with Supabase Row Level Security — only you can see your bookmarks.",
  },
  {
    q: "Can I import existing bookmarks?",
    a: "Not yet, but we're working on a one-click import from all major browsers. Stay tuned!",
  },
  {
    q: "Does AI auto-generate work for any URL?",
    a: "Yes! Our AI reads the page content and generates a meaningful title and summary for any public URL.",
  },
];

/* ── Page ───────────────────────────────────────────────── */

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Redirect to dashboard if logged in - Vercel Update
    redirect("/dashboard");
  }

  return (
    <div className="relative flex flex-col overflow-hidden isolate">
      {/* ── Animated gradient background ─────────────────── */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-900 via-blue-900 to-zinc-900" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-slow" />

      {/* ═══════════════ HERO ═══════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 pt-20 pb-16 md:pt-36 md:pb-28 text-center">
        <ScrollReveal>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            LinkVault
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <p className="text-lg md:text-2xl text-zinc-300 max-w-2xl mx-auto mb-10">
            Save, organize, and enhance your bookmarks with AI — all in one
            beautiful place.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={300}>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </ScrollReveal>
      </section>

      {/* ═══════════════ FEATURES (staggered) ═══════════════ */}
      <section className="w-full max-w-6xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 150}>
              <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl h-full">
                <f.icon className={`w-12 h-12 mb-4 ${f.color}`} />
                <h3 className="text-2xl font-bold mb-3 text-white">
                  {f.title}
                </h3>
                <p className="text-zinc-300 text-base leading-relaxed">
                  {f.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════════════ STATS / SOCIAL PROOF ══════════════ */}
      <ScrollReveal>
        <section className="w-full border-y border-white/10 bg-white/5 backdrop-blur-lg">
          <div className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  <AnimatedCounter end={s.value} />
                </p>
                <p className="mt-2 text-zinc-400 text-sm uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center text-zinc-500 text-sm pb-6">
            Join thousands already organizing their web.
          </p>
        </section>
      </ScrollReveal>

      {/* ═══════════════ HOW IT WORKS ══════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 py-24 text-center">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-zinc-400 mb-14 max-w-xl mx-auto">
            Get started in under 30 seconds — no setup required.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((s, i) => (
            <ScrollReveal key={s.step} delay={i * 200}>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-5 shadow-lg">
                  <s.icon className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
                  Step {s.step}
                </span>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                  {s.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════════════ COMPARISON TABLE ═════════════════ */}
      <ScrollReveal>
        <section className="max-w-3xl mx-auto px-4 pb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
            LinkVault vs Browser Bookmarks
          </h2>
          <p className="text-zinc-400 mb-10 text-center max-w-xl mx-auto">
            See why thousands have switched.
          </p>

          <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur-xl">
            {/* Header */}
            <div className="grid grid-cols-3 text-center text-sm font-semibold uppercase tracking-wider border-b border-white/10">
              <div className="py-4 text-zinc-400">Feature</div>
              <div className="py-4 text-blue-400">LinkVault</div>
              <div className="py-4 text-zinc-500">Browser</div>
            </div>

            {comparison.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 text-center text-sm ${i < comparison.length - 1 ? "border-b border-white/5" : ""
                  }`}
              >
                <div className="py-3.5 text-zinc-300 text-left pl-6">
                  {row.feature}
                </div>
                <div className="py-3.5 flex justify-center">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="py-3.5 flex justify-center">
                  <X className="w-5 h-5 text-red-400/60" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ═══════════════ FAQ ══════════════════════════════ */}
      <section className="max-w-3xl mx-auto px-4 pb-24">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-400 mb-10 text-center">
            Everything you need to know.
          </p>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <ScrollReveal key={faq.q} delay={i * 100}>
              <details className="group rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-white font-medium select-none list-none">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-zinc-400 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-4 text-zinc-400 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════════════ BOTTOM CTA ══════════════════════ */}
      <ScrollReveal>
        <section className="text-center px-4 pb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to organize your web?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            It&apos;s free, fast, and takes less than 30 seconds to get started.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </ScrollReveal>

      {/* ═══════════════ FOOTER ═══════════════════════════ */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                LinkVault
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Your smart, AI-powered bookmark manager.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>
                  <Link
                    href="/login"
                    className="hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <span className="cursor-default">Pricing</span>
                </li>
                <li>
                  <span className="cursor-default">Changelog</span>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                Legal
              </h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>
                  <span className="cursor-default">Privacy Policy</span>
                </li>
                <li>
                  <span className="cursor-default">Terms of Service</span>
                </li>
                <li>
                  <span className="cursor-default">Contact</span>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                Community
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/5 text-center text-xs text-zinc-600">
            © {new Date().getFullYear()} LinkVault. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
