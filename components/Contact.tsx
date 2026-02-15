"use client";

import { useState } from "react";
import { Send, Mail, Github, Linkedin, Twitter, Sparkles, CheckCircle } from "lucide-react";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        type: "suggestion",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsSuccess(true);
                setFormData({ name: "", email: "", message: "", type: "suggestion" });
                setTimeout(() => setIsSuccess(false), 5000);
            }
        } catch (error) {
            console.error("Contact form error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-blue-950 via-purple-950 to-zinc-950">
            {/* Gradient mesh background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.15),transparent_50%)]" />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Glass-morphism card */}
                <div className="bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/10 overflow-hidden">
                    <div className="grid md:grid-cols-5 gap-0">
                        {/* Left Column - Info (2/5) */}
                        <div className="md:col-span-2 p-8 lg:p-12 bg-gradient-to-br from-purple-900/40 to-transparent border-r border-purple-500/20">
                            <div className="flex items-center gap-2 mb-6">
                                <Sparkles className="w-6 h-6 text-purple-400" />
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Let's Connect
                                </h2>
                            </div>

                            <p className="text-zinc-300 mb-8 leading-relaxed">
                                Have ideas, feedback, or want to collaborate? I'd love to hear from you and make LinkVault better together!
                            </p>

                            {/* Contact info */}
                            <div className="space-y-4 mb-10">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-purple-400 mt-0.5" />
                                    <div>
                                        <h3 className="text-sm font-semibold text-zinc-200 mb-1">Get in Touch</h3>
                                        <ul className="text-sm text-zinc-400 space-y-1">
                                            <li>• Feature suggestions</li>
                                            <li>• Bug reports</li>
                                            <li>• Collaborations</li>
                                            <li>• General inquiries</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Social links */}
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                                    🌐 Connect With Me
                                </h3>
                                <div className="flex gap-3">
                                    <a
                                        href="https://github.com/yourusername"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-zinc-800/80 hover:bg-purple-500/20 border border-zinc-700 hover:border-purple-500/40 rounded-lg transition-all hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20"
                                        aria-label="GitHub"
                                    >
                                        <Github className="w-5 h-5 text-zinc-400 hover:text-purple-400 transition-colors" />
                                    </a>
                                    <a
                                        href="https://linkedin.com/in/yourusername"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-zinc-800/80 hover:bg-purple-500/20 border border-zinc-700 hover:border-purple-500/40 rounded-lg transition-all hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20"
                                        aria-label="LinkedIn"
                                    >
                                        <Linkedin className="w-5 h-5 text-zinc-400 hover:text-purple-400 transition-colors" />
                                    </a>
                                    <a
                                        href="mailto:your@email.com"
                                        className="p-3 bg-zinc-800/80 hover:bg-purple-500/20 border border-zinc-700 hover:border-purple-500/40 rounded-lg transition-all hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20"
                                        aria-label="Email"
                                    >
                                        <Mail className="w-5 h-5 text-zinc-400 hover:text-purple-400 transition-colors" />
                                    </a>
                                    <a
                                        href="https://twitter.com/yourusername"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-zinc-800/80 hover:bg-purple-500/20 border border-zinc-700 hover:border-purple-500/40 rounded-lg transition-all hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20"
                                        aria-label="Twitter"
                                    >
                                        <Twitter className="w-5 h-5 text-zinc-400 hover:text-purple-400 transition-colors" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Form (3/5) */}
                        <div className="md:col-span-3 p-8 lg:p-12">
                            <h3 className="text-xl font-semibold text-zinc-100 mb-6">Quick Contact</h3>

                            {isSuccess ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <CheckCircle className="w-16 h-16 text-green-400 mb-4 animate-bounce" />
                                    <h4 className="text-xl font-semibold text-zinc-100 mb-2">Message Sent!</h4>
                                    <p className="text-zinc-400">Thanks for reaching out. I'll get back to you within 24 hours.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Name & Email */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                                                Your Name
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="John Doe"
                                                className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="john@example.com"
                                                className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">
                                            Your Message
                                        </label>
                                        <textarea
                                            id="message"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Tell me what's on your mind..."
                                            rows={5}
                                            className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Type selector */}
                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-zinc-300 mb-2">
                                            Type of Inquiry
                                        </label>
                                        <select
                                            id="type"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                        >
                                            <option value="suggestion">💡 Feature Suggestion</option>
                                            <option value="bug">🐛 Bug Report</option>
                                            <option value="collaboration">🤝 Collaboration</option>
                                            <option value="other">💬 General Inquiry</option>
                                        </select>
                                    </div>

                                    {/* Submit button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all disabled:opacity-50 active:scale-[0.98]"
                                    >
                                        <Send className="w-4 h-4" />
                                        {isSubmitting ? "Sending..." : "Send Message"}
                                    </button>

                                    <p className="text-center text-sm text-zinc-400 flex items-center justify-center gap-1">
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                        Average response time: 24 hours
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
