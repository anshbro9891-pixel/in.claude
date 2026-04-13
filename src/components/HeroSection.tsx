"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Code2, Brain, Globe2 } from "lucide-react";
import InclawLogo from "@/components/InclawLogo";

const TYPING_TEXTS = [
  "Build a FastAPI server with JWT auth and rate limiting...",
  "Debug this segfault in my Rust async code...",
  "Optimize this N+1 SQL query with proper indexing...",
  "Write comprehensive tests for my React component...",
  "Architect a microservices system for 10M users...",
  "Explain this Kubernetes YAML and fix the crash loop...",
];

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 8 + 5,
  delay: Math.random() * 4,
}));

export default function HeroSection() {
  const [typingIndex, setTypingIndex]   = useState(0);
  const [displayText, setDisplayText]   = useState("");
  const [isDeleting, setIsDeleting]     = useState(false);
  const [mounted, setMounted]           = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const currentText = TYPING_TEXTS[typingIndex];
    const timeout = setTimeout(
      () => {
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
            setTypingIndex((prev) => (prev + 1) % TYPING_TEXTS.length);
          }
        }
      },
      isDeleting ? 25 : 55
    );
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, typingIndex]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">

      {/* Deep space background */}
      <div className="absolute inset-0 bg-neural" />
      <div className="absolute inset-0 bg-grid opacity-60" />

      {/* Large atmospheric orbs */}
      <div className="absolute -top-1/4 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-orange-500/5 blur-[140px]" />
      <div className="absolute -bottom-1/4 right-1/4 h-[600px] w-[600px] rounded-full bg-cyan-500/5 blur-[120px]" />
      <div className="absolute top-1/3 left-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/4 blur-[100px]" />

      {/* Floating star particles */}
      {mounted && PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.id % 3 === 0
              ? "rgba(249,115,22,0.5)"
              : p.id % 3 === 1
                ? "rgba(6,182,212,0.5)"
                : "rgba(167,139,250,0.5)",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationName: p.id % 2 === 0 ? "float-a" : "float-b",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        />
      ))}

      {/* Orbital ring decoration */}
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-500/5 animate-orbit-slow" />
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/5 animate-orbit-rev" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">

        {/* Logo + Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "backOut" }}
          className="mb-8 flex flex-col items-center gap-5"
        >
          <div className="relative">
            <InclawLogo size={80} animated className="drop-shadow-2xl" />
            <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-2xl animate-pulse-glow" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/8 px-5 py-2 text-sm font-medium text-orange-300 backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5" />
            India&apos;s Open-Source Agentic AI &bull; 9 Models &bull; Supabase-Powered
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mx-auto max-w-5xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span className="text-gradient-saffron glow-text-orange">INCLAW</span>
          <br />
          <span className="text-white">The AI That </span>
          <span className="text-gradient-cyan glow-text-cyan">Thinks</span>
          <span className="text-white">, </span>
          <span className="text-gradient-full">Codes</span>
          <span className="text-white">, Conquers.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl"
        >
          India&apos;s most powerful open-source agentic AI — plans, reasons, searches
          and writes production-grade code across 619+ languages. No limits. No lock-in.
        </motion.p>

        {/* Typing terminal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mx-auto mt-10 max-w-2xl"
        >
          <div className="gradient-border">
            <div className="glass rounded-2xl px-6 py-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/5 mb-3">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-slate-600 font-mono">inclaw — neural terminal</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-orange-400 shrink-0">$ inclaw</span>
                <span className="font-mono text-sm text-slate-300 sm:text-base truncate">
                  {displayText}
                  <span className="animate-blink text-orange-400">▋</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/chat"
            className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-orange-500/30 transition-all hover:shadow-2xl hover:shadow-orange-500/40 hover:scale-105"
          >
            <span className="absolute inset-0 -skew-x-12 translate-x-[-110%] bg-white/20 transition-transform duration-700 group-hover:translate-x-[110%]" />
            <Sparkles className="h-5 w-5" />
            Launch INCLAW Agent
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/workspace"
            className="group flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-8 py-3.5 text-base font-bold text-cyan-300 transition-all hover:bg-cyan-500/20 hover:text-white hover:scale-105"
          >
            <Code2 className="h-5 w-5" />
            Open Workspace
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#demo"
            className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-base font-medium text-slate-300 backdrop-blur-sm transition-all hover:border-orange-500/30 hover:bg-orange-500/5 hover:text-white"
          >
            Watch it think
          </a>
        </motion.div>

        {/* Capability badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mx-auto mt-10 flex flex-wrap justify-center gap-3"
        >
          {[
            { icon: Brain,  label: "Deep Reasoning" },
            { icon: Code2,  label: "Agentic Coding" },
            { icon: Globe2, label: "619+ Languages" },
            { icon: Sparkles, label: "Multi-Model" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-4 py-1.5 text-xs text-slate-400 backdrop-blur-sm"
            >
              <Icon className="h-3.5 w-3.5 text-cyan-400" />
              {label}
            </div>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4"
        >
          {[
            { value: "9+",    label: "Open Models",     color: "text-orange-400" },
            { value: "619+",  label: "Languages",        color: "text-cyan-400" },
            { value: "100%",  label: "Open Source",      color: "text-purple-400" },
            { value: "🇮🇳",    label: "Made in India",    color: "text-white" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`text-2xl font-black sm:text-3xl ${stat.color}`}>
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-slate-600 sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#020010] to-transparent" />
    </section>
  );
}
