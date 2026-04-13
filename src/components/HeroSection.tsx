"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Code2 } from "lucide-react";

const TYPING_TEXTS = [
  "Generate a FastAPI server with auth...",
  "Debug this React component...",
  "Write unit tests for my Go service...",
  "Optimize this SQL query...",
  "Create a Kubernetes deployment...",
];

export default function HeroSection() {
  const [typingIndex, setTypingIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = TYPING_TEXTS[typingIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentText.length) {
            setDisplayText(currentText.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 1500);
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
      isDeleting ? 30 : 60
    );
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, typingIndex]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-orange-500/10 blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[128px]" />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[10%] top-[20%] h-3 w-3 rounded-full bg-orange-400/60"
      />
      <motion.div
        animate={{ y: [15, -15, 15], x: [10, -10, 10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[15%] top-[30%] h-2 w-2 rounded-full bg-cyan-400/60"
      />
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[20%] bottom-[25%] h-4 w-4 rounded-full bg-orange-400/30"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-sm text-orange-300"
        >
          <Zap className="h-3.5 w-3.5" />
          <span>
            Powered by Open-Source LLMs • Made in India 🇮🇳
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto max-w-5xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span className="bg-gradient-to-r from-orange-400 via-orange-300 to-amber-300 bg-clip-text text-transparent">
            INCLAW
          </span>
          <br />
          <span className="text-white">
            India&apos;s AI{" "}
          </span>
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Coding Agent
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 sm:text-xl"
        >
          An agentic AI that writes, debugs, and optimizes production-grade code.
          Built entirely on open-source models — no black boxes, no limits.
        </motion.p>

        {/* Typing animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-10 max-w-2xl"
        >
          <div className="gradient-border">
            <div className="flex items-center gap-3 rounded-2xl bg-[#0a0625] px-6 py-4">
              <Code2 className="h-5 w-5 shrink-0 text-orange-400" />
              <span className="font-mono text-sm text-slate-300 sm:text-base">
                {displayText}
                <span className="animate-blink text-orange-400">|</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/chat"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:from-orange-400 hover:to-orange-500 hover:shadow-xl hover:shadow-orange-500/30"
          >
            <Sparkles className="h-5 w-5" />
            Start Coding with INCLAW
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#demo"
            className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-base font-medium text-slate-300 transition-all hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            See it in action
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-8 sm:grid-cols-4"
        >
          {[
            { value: "6+", label: "Open-Source Models" },
            { value: "619+", label: "Languages" },
            { value: "100%", label: "Open Source" },
            { value: "🇮🇳", label: "Made in India" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-white sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-slate-500 sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030014] to-transparent" />
    </section>
  );
}
