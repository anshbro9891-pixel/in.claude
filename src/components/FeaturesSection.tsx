"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Layers,
  Bug,
  Globe,
  Unlock,
  Flag,
} from "lucide-react";
import { FEATURES } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  brain: Brain,
  layers: Layers,
  bug: Bug,
  globe: Globe,
  unlock: Unlock,
  flag: Flag,
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-orange-400">
            Capabilities
          </h2>
          <p className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            What Makes INCLAW{" "}
            <span className="bg-gradient-to-r from-orange-400 to-cyan-400 bg-clip-text text-transparent">
              Different
            </span>
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Not just another code assistant. INCLAW is a full agentic system that
            plans, executes, and iterates — like a senior developer on your team.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = iconMap[feature.icon] || Brain;
            return (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#0a0625]/60 p-8 backdrop-blur-sm transition-all hover:border-orange-500/30 hover:bg-[#0f0a2a]/80"
              >
                {/* Glow on hover */}
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-orange-500/0 blur-3xl transition-all group-hover:bg-orange-500/10" />

                <div className="relative">
                  <div className="mb-5 inline-flex rounded-xl bg-gradient-to-br from-orange-500/20 to-cyan-500/20 p-3">
                    <Icon className="h-6 w-6 text-orange-400" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
