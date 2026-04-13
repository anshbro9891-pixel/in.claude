"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Code2, Brain, Globe2, ChevronDown } from "lucide-react";
import InclawLogo from "@/components/InclawLogo";

const TYPING_TEXTS = [
  "Build a FastAPI server with JWT auth and rate limiting...",
  "Debug this segfault in my Rust async code...",
  "Optimize this N+1 SQL query with proper indexing...",
  "Write comprehensive tests for my React component...",
  "Architect a microservices system for 10M users...",
  "Explain this Kubernetes YAML and fix the crash loop...",
];

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 10 + 7,
  delay: Math.random() * 5,
}));

const STAT_ITEMS = [
  { value: "9+",    label: "Open Models",  color: "text-orange-400" },
  { value: "619+",  label: "Languages",    color: "text-cyan-400"   },
  { value: "100%",  label: "Open Source",  color: "text-purple-400" },
  { value: "🇮🇳",    label: "Made in India",color: "text-white"      },
];

const BADGE_ITEMS = [
  { icon: Brain,    label: "Deep Reasoning"  },
  { icon: Code2,    label: "Agentic Coding"  },
  { icon: Globe2,   label: "619+ Languages"  },
  { icon: Sparkles, label: "Multi-Model"     },
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [typingIndex, setTypingIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting]   = useState(false);
  const [mounted, setMounted]         = useState(false);
  const [counters, setCounters]       = useState({ models: 0, langs: 0 });

  // Parallax hooks
  const { scrollYProgress } = useScroll({ target: containerRef });
  const yTitle   = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const yBg      = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity  = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const springY  = useSpring(yTitle, { stiffness: 80, damping: 30 });

  // Mount
  useEffect(() => {
    const mountId = setTimeout(() => setMounted(true), 0);
    // Count-up animation for stats
    const start = performance.now();
    const duration = 1800;
    let rId: number;
    const animate = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCounters({ models: Math.round(ease * 9), langs: Math.round(ease * 619) });
      if (p < 1) { rId = requestAnimationFrame(animate); }
    };
    rId = requestAnimationFrame(animate);
    return () => { clearTimeout(mountId); cancelAnimationFrame(rId); };
  }, []);

  // Typing effect
  useEffect(() => {
    const currentText = TYPING_TEXTS[typingIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setTypingIndex((p) => (p + 1) % TYPING_TEXTS.length);
        }
      }
    }, isDeleting ? 22 : 52);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, typingIndex]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16"
    >
      {/* ── Cinematic background layers ── */}
      <motion.div className="absolute inset-0" style={{ y: yBg }}>
        <div className="absolute inset-0 bg-neural" />
        <div className="absolute inset-0 bg-grid opacity-50" />
      </motion.div>

      {/* Scanlines overlay */}
      <div className="absolute inset-0 scanlines opacity-[0.04] pointer-events-none" />

      {/* Vignette */}
      <div className="absolute inset-0 vignette pointer-events-none" />

      {/* Atmospheric orbs — parallax */}
      <motion.div
        className="absolute -top-1/4 left-1/2 h-[900px] w-[900px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)", y: yBg }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-1/4 right-1/4 h-[700px] w-[700px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute top-1/3 left-1/4 h-[500px] w-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* Orbital ring decorations */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-500/4"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/4"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating particles */}
      {mounted && PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: `${p.size}px`, height: `${p.size}px`,
            background: p.id % 3 === 0
              ? "rgba(249,115,22,0.55)"
              : p.id % 3 === 1
                ? "rgba(6,182,212,0.55)"
                : "rgba(167,139,250,0.55)",
          }}
          animate={{ y: [0, -28, 0], opacity: [0, 0.9, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* ── Content ── */}
      <motion.div
        style={{ y: springY, opacity }}
        className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8"
      >
        {/* Logo + badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex flex-col items-center gap-5"
        >
          <div className="relative">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <InclawLogo size={88} animated className="drop-shadow-2xl rgb-shift" />
            </motion.div>
            {/* Pulsing rings */}
            {[1, 2, 3].map((n) => (
              <motion.div
                key={n}
                className="absolute inset-0 rounded-full border border-orange-500/20"
                animate={{ scale: [1, 1.6 + n * 0.3], opacity: [0.4, 0] }}
                transition={{ duration: 2.5, delay: n * 0.5, repeat: Infinity, ease: "easeOut" }}
              />
            ))}
          </div>

          {/* Animated badge */}
          <motion.div
            animate={{ boxShadow: ["0 0 0 0 rgba(249,115,22,0)", "0 0 20px 4px rgba(249,115,22,0.15)", "0 0 0 0 rgba(249,115,22,0)"] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/8 px-5 py-2 text-sm font-medium text-orange-300 backdrop-blur-sm"
          >
            <Zap className="h-3.5 w-3.5" />
            India&apos;s Open-Source Agentic AI &bull; 9 Models &bull; Full Flow
          </motion.div>
        </motion.div>

        {/* ── Headline — cinematic stagger ── */}
        <div className="mx-auto max-w-5xl">
          <motion.h1
            className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {[
              { text: "INCLAW",   className: "text-gradient-saffron glow-text-orange block" },
              { text: "The AI That ", className: "text-white" },
              { text: "Thinks",   className: "text-gradient-cyan glow-text-cyan" },
              { text: ", ",       className: "text-white" },
              { text: "Codes",    className: "text-gradient-full" },
              { text: ", Conquers.", className: "text-white" },
            ].map((part, i) => (
              <motion.span
                key={i}
                className={part.className}
                variants={{
                  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
                  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                {part.text}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl"
        >
          India&apos;s most powerful open-source agentic AI — plans, reasons, searches
          and writes production-grade code across 619+ languages.
          <span className="text-orange-400"> No limits. No lock-in.</span>
        </motion.p>

        {/* Typing terminal */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mx-auto mt-10 max-w-2xl"
        >
          <div className="gradient-border shadow-neural">
            <div className="glass-noise rounded-2xl px-6 py-4">
              {/* Laser scan line inside terminal */}
              <div className="relative overflow-hidden">
                <div className="laser-scan" />
              </div>
              <div className="flex items-center gap-2 pb-3 border-b border-white/5 mb-3">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-slate-600 font-mono">inclaw — neural terminal v2.0</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-orange-400 shrink-0">$ inclaw</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={displayText.length < 3 ? "reset" : "typing"}
                    className="font-mono text-sm text-slate-300 sm:text-base truncate"
                  >
                    {displayText}
                    <span className="animate-blink text-orange-400">▋</span>
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/signup"
            className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-orange-500/30 transition-all hover:shadow-2xl hover:shadow-orange-500/40 hover:scale-105"
          >
            <span className="absolute inset-0 -skew-x-12 translate-x-[-110%] bg-white/20 transition-transform duration-700 group-hover:translate-x-[110%]" />
            <Sparkles className="h-5 w-5" />
            Get Started Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/chat"
            className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-base font-medium text-slate-300 backdrop-blur-sm transition-all hover:border-orange-500/30 hover:bg-orange-500/5 hover:text-white"
          >
            Launch agent
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Capability badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="mx-auto mt-10 flex flex-wrap justify-center gap-3"
        >
          {BADGE_ITEMS.map(({ icon: Icon, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + i * 0.06 }}
              className="flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-4 py-1.5 text-xs text-slate-400 backdrop-blur-sm holo-border"
            >
              <Icon className="h-3.5 w-3.5 text-cyan-400" />
              {label}
            </motion.div>
          ))}
        </motion.div>

        {/* Stats — count-up animation */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4"
        >
          {STAT_ITEMS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05 + i * 0.08 }}
              className="text-center"
            >
              <div className={`text-2xl font-black sm:text-3xl ${stat.color}`}>
                {stat.value === "9+"
                  ? `${mounted ? counters.models : 0}+`
                  : stat.value === "619+"
                    ? `${mounted ? counters.langs : 0}+`
                    : stat.value}
              </div>
              <div className="mt-1 text-xs text-slate-600 sm:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-slate-700"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#020010] to-transparent pointer-events-none" />
    </section>
  );
}
