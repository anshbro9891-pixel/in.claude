"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, Sparkles } from "lucide-react";
import InclawLogo from "@/components/InclawLogo";
import { signIn } from "@/lib/auth";

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  dur: Math.random() * 10 + 6,
  delay: Math.random() * 6,
}));

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    setError(null);
    const { user, error: authError } = await signIn(email.trim(), password);
    setLoading(false);
    if (authError) { setError(authError); return; }
    if (user) router.push("/dashboard");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020010]">

      {/* ── Deep cinematic background ── */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-neural" />
        <div className="absolute inset-0 bg-grid opacity-40" />
        {/* Scanlines */}
        <div className="absolute inset-0 scanlines opacity-[0.03] pointer-events-none" />
        {/* Atmospheric orbs */}
        <motion.div
          className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-orange-500/8 blur-[130px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/8 blur-[110px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.75, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* ── Floating particles ── */}
      {mounted && PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: `${p.size}px`, height: `${p.size}px`,
            background: p.id % 3 === 0 ? "rgba(249,115,22,0.6)" : p.id % 3 === 1 ? "rgba(6,182,212,0.6)" : "rgba(167,139,250,0.6)",
          }}
          animate={{ y: [0, -20, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* ── Back to home ── */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-white z-10"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      {/* ── Login card ── */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Card surface */}
        <div className="auth-card relative overflow-hidden rounded-3xl border border-white/8 bg-[#030018]/80 p-8 shadow-2xl shadow-black/60 backdrop-blur-3xl">

          {/* Corner shimmer */}
          <div className="absolute -top-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />

          {/* Header */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <InclawLogo size={56} animated />
              <div className="absolute inset-0 rounded-full bg-orange-500/25 blur-2xl animate-pulse-glow" />
            </motion.div>
            <div className="text-center">
              <h1 className="text-2xl font-black text-white">
                Welcome back to{" "}
                <span className="text-gradient-saffron">INC</span>
                <span className="text-gradient-cyan">LAW</span>
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                Sign in to your agentic AI workspace
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Email address
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="auth-input w-full rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-orange-500/50 focus:bg-white/6 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium text-slate-400">Password</label>
                <Link href="/forgot-password" className="text-xs text-slate-600 transition-colors hover:text-orange-400">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="auth-input w-full rounded-xl border border-white/8 bg-white/4 px-4 py-3 pr-11 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-orange-500/50 focus:bg-white/6 focus:ring-2 focus:ring-orange-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/35 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 -skew-x-12 translate-x-[-110%] bg-white/20 transition-transform duration-700 group-hover:translate-x-[110%]" />
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Sign in to INCLAW
                </span>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-white/6" />
            <span className="text-xs text-slate-700">OR</span>
            <div className="flex-1 border-t border-white/6" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-slate-600">
            New to INCLAW?{" "}
            <Link href="/signup" className="font-medium text-orange-400 transition-colors hover:text-orange-300">
              Create an account
            </Link>
          </p>
        </div>

        {/* Open source note */}
        <p className="mt-5 text-center text-xs text-slate-700">
          100% open source · Self-host anytime ·{" "}
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-500 transition-colors">
            View on GitHub
          </a>
        </p>
      </motion.div>
    </div>
  );
}
