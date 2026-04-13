"use client";

import { motion } from "framer-motion";
import { Cpu, ExternalLink } from "lucide-react";
import { SUPPORTED_MODELS } from "@/lib/constants";

export default function ModelsSection() {
  return (
    <section
      id="models"
      className="relative py-24 sm:py-32"
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/[0.02] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Open-Source Foundation
          </h2>
          <p className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Powered by the{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Best Open Models
            </span>
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            INCLAW leverages a multi-model architecture, routing your requests to
            the most capable open-source LLM for each task.
          </p>
        </motion.div>

        {/* Model grid */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SUPPORTED_MODELS.map((model, i) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#0a0625]/60 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/30 hover:bg-[#0f0a2a]/80"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cyan-500/0 blur-3xl transition-all group-hover:bg-cyan-500/10" />

              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <div className="inline-flex rounded-lg bg-cyan-500/10 p-2">
                    <Cpu className="h-5 w-5 text-cyan-400" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-slate-400">
                    {model.parameters}
                  </span>
                </div>

                <h3 className="mb-1 text-lg font-semibold text-white">
                  {model.name}
                </h3>
                <p className="mb-1 text-xs text-cyan-400/80">{model.provider}</p>
                <p className="mb-4 text-sm text-slate-400">{model.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {model.strengths.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs text-slate-500">
                  <ExternalLink className="h-3 w-3" />
                  {model.license}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
