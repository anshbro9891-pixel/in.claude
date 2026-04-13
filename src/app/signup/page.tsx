"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, AlertCircle, Check, ArrowLeft, Sparkles, User, Mail, Lock } from "lucide-react";
import InclawLogo from "@/components/InclawLogo";
import { signUp } from "@/lib/auth";

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  dur: Math.random() * 10 + 6,
  delay: Math.random() * 6,
}));

const PERKS = [
  "Chat with 9 open-source LLMs",
  "Persistent chat history via Supabase",
  "Agentic multi-step reasoning chain",
  "619+ programming languages",
  "Self-host with Ollama locally",
];

export default function SignupPage() {
  const router = useRouter();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  const passwordStrength = (() => {
    if (password.length === 0) return 0;
    let score = 0;
    if (password.length >= 8)  score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passwordStrength];
  const strengthColor = ["", "bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-emerald-500"][passwordStrength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) return;
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8)  { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setError(null);
    const { user, error: authError } = await signUp(email.trim(), password, name.trim());
    setLoading(false);
    if (authError) { setError(authError); return; }
    if (user) {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2500);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020010]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30"
          >
            <Check className="h-10 w-10 text-emerald-400" />
          </motion.div>
          <h2 className="text-2xl font-black text-white">Account created!</h2>
          <p className="mt-2 text-slate-500">Redirecting to your workspace…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020010] py-12">

      {/* ── Background ── */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-neural" />
        <div className="absolute inset-0 bg-grid opacity-35" />
        <div className="absolute inset-0 scanlines opacity-[0.03] pointer-events-none" />
        <motion.div
          className="absolute right-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-cyan-500/6 blur-[140px]"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/4 bottom-1/3 h-[400px] w-[400px] rounded-full bg-orange-500/6 blur-[110px]"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>

      {/* Particles */}
      {mounted && PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: `${p.size}px`, height: `${p.size}px`,
            background: p.id % 3 === 0 ? "rgba(249,115,22,0.5)" : p.id % 3 === 1 ? "rgba(6,182,212,0.5)" : "rgba(167,139,250,0.5)",
          }}
          animate={{ y: [0, -18, 0], opacity: [0, 0.7, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-white z-10">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      {/* ── Two-column layout ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 lg:flex-row lg:items-center lg:gap-16">

        {/* Left: Perks */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block flex-1"
        >
          <div className="flex items-center gap-3 mb-6">
            <InclawLogo size={44} animated />
            <span className="text-2xl font-extrabold">
              <span className="text-gradient-saffron">INC</span>
              <span className="text-gradient-cyan">LAW</span>
            </span>
          </div>
          <h2 className="text-3xl font-black text-white leading-tight mb-4">
            India&apos;s Open AI<br />
            <span className="text-gradient-full">Now Yours.</span>
          </h2>
          <p className="text-slate-500 leading-relaxed mb-8">
            Join the agentic coding revolution. Free forever. Open source.
          </p>
          <ul className="space-y-3">
            {PERKS.map((perk, i) => (
              <motion.li
                key={perk}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-3 text-sm text-slate-400"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                  <Check className="h-3 w-3 text-emerald-400" />
                </div>
                {perk}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Right: Form card */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="w-full max-w-md flex-shrink-0 mx-auto lg:mx-0"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-[#030018]/80 p-8 shadow-2xl shadow-black/60 backdrop-blur-3xl">
            <div className="absolute -top-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

            <div className="mb-7">
              <h1 className="text-xl font-black text-white">Create your account</h1>
              <p className="mt-1 text-sm text-slate-500">Free forever. No credit card required.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name */}
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="auth-input w-full rounded-xl border border-white/8 bg-white/4 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-cyan-500/50 focus:bg-white/6 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="auth-input w-full rounded-xl border border-white/8 bg-white/4 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-cyan-500/50 focus:bg-white/6 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (min 8 chars)"
                    className="auth-input w-full rounded-xl border border-white/8 bg-white/4 py-3 pl-10 pr-11 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-cyan-500/50 focus:bg-white/6 focus:ring-2 focus:ring-cyan-500/20"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1,2,3,4].map((n) => (
                        <div key={n} className={`h-1 w-7 rounded-full transition-all ${n <= passwordStrength ? strengthColor : "bg-white/10"}`} />
                      ))}
                    </div>
                    <span className="text-xs text-slate-600">{strengthLabel}</span>
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm password"
                  className="auth-input w-full rounded-xl border border-white/8 bg-white/4 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-cyan-500/50 focus:bg-white/6 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              {/* Error */}
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

              {/* Terms */}
              <p className="text-xs text-slate-600">
                By creating an account you agree to our{" "}
                <a href="#" className="text-orange-400 hover:text-orange-300">Terms</a>{" "}
                and{" "}
                <a href="#" className="text-orange-400 hover:text-orange-300">Privacy Policy</a>.
              </p>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-500 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-xl hover:shadow-cyan-500/35 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 -skew-x-12 translate-x-[-110%] bg-white/20 transition-transform duration-700 group-hover:translate-x-[110%]" />
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Create free account
                  </span>
                )}
              </motion.button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-orange-400 hover:text-orange-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
