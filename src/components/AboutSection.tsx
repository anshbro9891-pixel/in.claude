"use client";

import { motion } from "framer-motion";
import { Heart, Shield, Rocket, Users } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Fully Open Source",
    description:
      "Every model, every line of code, every training dataset — open and auditable. We believe AI should be transparent.",
  },
  {
    icon: Heart,
    title: "Made with Pride in India",
    description:
      "INCLAW represents India's growing strength in AI. Built by Indian engineers, for developers everywhere.",
  },
  {
    icon: Rocket,
    title: "Production-Ready Code",
    description:
      "Not toy examples — INCLAW generates code you can ship. Clean, tested, following best practices.",
  },
  {
    icon: Users,
    title: "Community-Driven",
    description:
      "Built by the community, for the community. Contribute models, datasets, and improvements on GitHub.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            About INCLAW
          </h2>
          <p className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            India&apos;s Answer to{" "}
            <span className="bg-gradient-to-r from-orange-400 to-cyan-400 bg-clip-text text-transparent">
              Proprietary AI
            </span>
          </p>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-400">
            INCLAW was born from a simple belief: world-class AI coding assistance
            should not be locked behind proprietary walls. By combining the best
            open-source large language models — CodeLlama, DeepSeek Coder,
            StarCoder2, Mixtral, Llama 3, and Qwen2.5 Coder — we&apos;ve built an
            agentic coding system that rivals the best proprietary solutions.
          </p>
        </motion.div>

        {/* Values grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-5 rounded-2xl border border-white/5 bg-[#0a0625]/60 p-6 backdrop-blur-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-cyan-500/20">
                <value.icon className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Architecture diagram placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-16 max-w-3xl rounded-2xl border border-white/10 bg-[#0a0625] p-8"
        >
          <h3 className="mb-6 text-center text-lg font-semibold text-white">
            How INCLAW Works
          </h3>
          <div className="flex flex-col items-center gap-4 text-sm">
            <div className="w-full max-w-md rounded-xl border border-orange-500/30 bg-orange-500/10 px-6 py-3 text-center text-orange-300">
              📝 Your Prompt
            </div>
            <div className="h-6 w-px bg-gradient-to-b from-orange-500/50 to-cyan-500/50" />
            <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-center text-slate-300">
              🧠 INCLAW Agent — Plans, Decomposes & Routes
            </div>
            <div className="h-6 w-px bg-gradient-to-b from-cyan-500/50 to-orange-500/50" />
            <div className="grid w-full max-w-lg grid-cols-3 gap-3">
              <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-center text-xs text-cyan-300">
                CodeLlama
              </div>
              <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-center text-xs text-cyan-300">
                DeepSeek
              </div>
              <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-center text-xs text-cyan-300">
                StarCoder2
              </div>
            </div>
            <div className="h-6 w-px bg-gradient-to-b from-orange-500/50 to-cyan-500/50" />
            <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-center text-slate-300">
              🔄 Iterates, Tests & Refines
            </div>
            <div className="h-6 w-px bg-gradient-to-b from-cyan-500/50 to-green-500/50" />
            <div className="w-full max-w-md rounded-xl border border-green-500/30 bg-green-500/10 px-6 py-3 text-center text-green-300">
              ✅ Production-Ready Code
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
