"use client";

import { motion } from "framer-motion";
import { Shield, Heart, Rocket, Users, Database, Brain } from "lucide-react";
import InclawLogo from "@/components/InclawLogo";

const values = [
  { icon: Shield,   title: "Zero Vendor Lock-in",   desc: "Every weight is open. Run Ollama locally, use Groq, HuggingFace, or Together AI. Swap models anytime." },
  { icon: Heart,    title: "Built with Indian Pride", desc: "INCLAW champions Digital India and Atmanirbhar Bharat in AI — built by Indian engineers for the world." },
  { icon: Rocket,   title: "Production-Grade Output", desc: "Not toy code. INCLAW outputs clean, tested, documented code following SOLID principles and security best practices." },
  { icon: Users,    title: "Community Driven",        desc: "Open-source under MIT. Contribute models, datasets, plugins and improvements on GitHub." },
  { icon: Database, title: "Persistent Memory",       desc: "Supabase-powered chat history. Resume sessions, search past conversations, and build on previous context." },
  { icon: Brain,    title: "Transparent Reasoning",   desc: "INCLAW shows every thinking step — planning, searching, generating, and self-reviewing. No black boxes." },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.02] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-6 flex justify-center">
            <InclawLogo size={56} animated />
          </div>
          <h2 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl">
            India&apos;s Answer to{" "}
            <span className="text-gradient-full">Proprietary AI</span>
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-500">
            INCLAW was born from a simple conviction — world-class AI should be open, auditable,
            and built on the shoulders of the open-source community. We combine the best open
            models into a multi-step agentic system backed by Supabase for memory and persistence.
          </p>
        </motion.div>

        {/* Values */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex gap-4 rounded-2xl border border-white/5 glass p-6"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-cyan-500/20">
                <v.icon className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h3 className="mb-1.5 text-sm font-bold text-white">{v.title}</h3>
                <p className="text-xs leading-relaxed text-slate-500">{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Architecture flow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-16 max-w-3xl rounded-2xl border border-white/8 glass p-8"
        >
          <h3 className="mb-6 text-center text-base font-bold text-white">
            INCLAW Architecture
          </h3>
          <div className="flex flex-col items-center gap-3 text-xs">
            {[
              { label: "Your Prompt",                 color: "border-orange-500/30 bg-orange-500/8 text-orange-300" },
              { label: "⬇",                           color: "text-slate-600",               divider: true },
              { label: "INCLAW Agent — Thinks & Plans", color: "border-white/10 bg-white/5 text-slate-300" },
              { label: "⬇",                           color: "text-slate-600",               divider: true },
              { label: "Model Router — Picks Best LLM", color: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300" },
              { label: "⬇",                           color: "text-slate-600",               divider: true },
            ].map((item, i) =>
              item.divider ? (
                <span key={i} className={item.color}>{item.label}</span>
              ) : (
                <div key={i} className={`w-full max-w-sm rounded-xl border px-5 py-2.5 text-center font-medium ${item.color}`}>
                  {item.label}
                </div>
              )
            )}
            <div className="grid w-full max-w-lg grid-cols-3 gap-2">
              {["CodeLlama", "DeepSeek", "Gemma 3"].map((m) => (
                <div key={m} className="rounded-lg border border-cyan-500/20 bg-cyan-500/8 px-3 py-2 text-center text-cyan-300">
                  {m}
                </div>
              ))}
            </div>
            {["⬇", "Self-Reviews & Fixes", "⬇"].map((item, i) =>
              item === "⬇" ? (
                <span key={i} className="text-slate-600">{item}</span>
              ) : (
                <div key={i} className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-center text-slate-300">
                  🔄 {item}
                </div>
              )
            )}
            <div className="w-full max-w-sm rounded-xl border border-emerald-500/30 bg-emerald-500/8 px-5 py-2.5 text-center text-emerald-300">
              ✅ Production-Ready Code
            </div>
            <span className="text-slate-600">⬇</span>
            <div className="w-full max-w-sm rounded-xl border border-purple-500/30 bg-purple-500/8 px-5 py-2.5 text-center text-purple-300">
              💾 Saved to Supabase
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
