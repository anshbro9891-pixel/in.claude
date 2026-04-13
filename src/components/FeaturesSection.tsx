"use client";

import { motion } from "framer-motion";
import {
  Brain, Layers, Bug, Globe, Unlock, Flag, Rocket, Database,
} from "lucide-react";
import { FEATURES } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  brain: Brain, layers: Layers, bug: Bug, globe: Globe,
  unlock: Unlock, flag: Flag, rocket: Rocket, database: Database,
};

const accentMap: Record<number, { border: string; glow: string; badge: string }> = {
  0: { border: "hover:border-orange-500/40",   glow: "bg-orange-500/10",  badge: "text-orange-400" },
  1: { border: "hover:border-cyan-500/40",     glow: "bg-cyan-500/10",    badge: "text-cyan-400"   },
  2: { border: "hover:border-red-500/40",      glow: "bg-red-500/10",     badge: "text-red-400"    },
  3: { border: "hover:border-purple-500/40",   glow: "bg-purple-500/10",  badge: "text-purple-400" },
  4: { border: "hover:border-emerald-500/40",  glow: "bg-emerald-500/10", badge: "text-emerald-400"},
  5: { border: "hover:border-blue-500/40",     glow: "bg-blue-500/10",    badge: "text-blue-400"   },
  6: { border: "hover:border-amber-500/40",    glow: "bg-amber-500/10",   badge: "text-amber-400"  },
  7: { border: "hover:border-pink-500/40",     glow: "bg-pink-500/10",    badge: "text-pink-400"   },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-dots opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-400">
            <Brain className="h-3.5 w-3.5" />
            Capabilities
          </div>
          <h2 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl">
            What Makes INCLAW{" "}
            <span className="text-gradient-full">Extraordinary</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Not just autocomplete. INCLAW is a full cognitive agent — it plans, reasons,
            searches, codes, tests and self-reviews.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => {
            const Icon = iconMap[feature.icon] || Brain;
            const accent = accentMap[i % 8];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className={`group relative overflow-hidden rounded-2xl border border-white/5 glass card-hover p-6 ${accent.border} transition-all duration-300`}
              >
                {/* Corner glow */}
                <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${accent.glow}`} />

                <div className="relative">
                  <div className={`mb-4 inline-flex rounded-xl p-3 ${accent.glow}`}>
                    <Icon className={`h-5 w-5 ${accent.badge}`} />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-white leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-500">
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
