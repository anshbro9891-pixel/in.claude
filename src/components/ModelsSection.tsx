"use client";

import { motion } from "framer-motion";
import { Cpu, ExternalLink, CheckCircle } from "lucide-react";
import { SUPPORTED_MODELS } from "@/lib/constants";

const colorMap: Record<string, { border: string; glow: string; badge: string; dot: string }> = {
  orange:  { border: "hover:border-orange-500/40",  glow: "bg-orange-500/8",   badge: "text-orange-300",  dot: "bg-orange-400"  },
  cyan:    { border: "hover:border-cyan-500/40",    glow: "bg-cyan-500/8",     badge: "text-cyan-300",    dot: "bg-cyan-400"    },
  purple:  { border: "hover:border-purple-500/40",  glow: "bg-purple-500/8",   badge: "text-purple-300",  dot: "bg-purple-400"  },
  violet:  { border: "hover:border-violet-500/40",  glow: "bg-violet-500/8",   badge: "text-violet-300",  dot: "bg-violet-400"  },
  blue:    { border: "hover:border-blue-500/40",    glow: "bg-blue-500/8",     badge: "text-blue-300",    dot: "bg-blue-400"    },
  emerald: { border: "hover:border-emerald-500/40", glow: "bg-emerald-500/8",  badge: "text-emerald-300", dot: "bg-emerald-400" },
  sky:     { border: "hover:border-sky-500/40",     glow: "bg-sky-500/8",      badge: "text-sky-300",     dot: "bg-sky-400"     },
  pink:    { border: "hover:border-pink-500/40",    glow: "bg-pink-500/8",     badge: "text-pink-300",    dot: "bg-pink-400"    },
  indigo:  { border: "hover:border-indigo-500/40",  glow: "bg-indigo-500/8",   badge: "text-indigo-300",  dot: "bg-indigo-400"  },
};

export default function ModelsSection() {
  return (
    <section id="models" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.015] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-400">
            <Cpu className="h-3.5 w-3.5" />
            Open-Source Foundation
          </div>
          <h2 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl">
            9 Elite{" "}
            <span className="text-gradient-cyan">Open Models</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            INCLAW routes your request to the best-fit model. All run locally via Ollama
            or on cloud inference APIs — 100% open source, zero vendor lock-in.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SUPPORTED_MODELS.map((model, i) => {
            const c = colorMap[model.color] ?? colorMap.cyan;
            return (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className={`group relative overflow-hidden rounded-2xl border border-white/5 glass card-hover p-6 transition-all duration-300 ${c.border}`}
              >
                <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl opacity-0 transition-opacity group-hover:opacity-100 ${c.glow}`} />

                <div className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.glow}`}>
                      <Cpu className={`h-4.5 w-4.5 ${c.badge}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${c.dot} animate-pulse`} />
                      <span className="rounded-full border border-white/8 bg-white/4 px-2 py-0.5 text-xs text-slate-500">
                        {model.parameters}
                      </span>
                    </div>
                  </div>

                  <h3 className="mb-1 text-base font-bold text-white">{model.name}</h3>
                  <p className={`mb-1 text-xs font-medium ${c.badge}`}>{model.provider}</p>
                  <p className="mb-4 text-xs leading-relaxed text-slate-500">{model.description}</p>

                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {model.strengths.map((s) => (
                      <span key={s} className="flex items-center gap-1 rounded-md bg-white/4 px-2 py-0.5 text-xs text-slate-400">
                        <CheckCircle className="h-2.5 w-2.5 text-green-400" />
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <code className="rounded bg-white/4 px-2 py-0.5 text-xs font-mono text-slate-500">
                      {model.ollamaTag}
                    </code>
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <ExternalLink className="h-3 w-3" />
                      {model.license}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Ollama CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-10 max-w-2xl rounded-2xl border border-cyan-500/20 glass-cyan p-6 text-center"
        >
          <p className="text-sm text-slate-400">
            Run any model locally with{" "}
            <code className="rounded bg-white/6 px-1.5 py-0.5 text-xs font-mono text-cyan-300">
              ollama pull codellama:34b
            </code>{" "}
            or connect to HuggingFace, Groq, or Together AI via the API settings.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
