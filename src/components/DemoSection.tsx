"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, ChevronRight, Cpu, Brain, Search, Code2, Eye } from "lucide-react";
import { DEMO_CONVERSATIONS } from "@/lib/constants";

const THINKING_CHAIN = [
  { icon: Brain,  label: "Analyzing requirements",   color: "text-orange-400",  delay: 0 },
  { icon: Search, label: "Searching knowledge base",  color: "text-cyan-400",    delay: 0.3 },
  { icon: Code2,  label: "Generating solution",       color: "text-purple-400",  delay: 0.6 },
  { icon: Eye,    label: "Self-reviewing for bugs",   color: "text-emerald-400", delay: 0.9 },
];

export default function DemoSection() {
  const [activeDemo, setActiveDemo] = useState(0);
  const [copied, setCopied]         = useState(false);
  const [showThinking, setShowThinking] = useState(false);

  const current = DEMO_CONVERSATIONS[activeDemo];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDemoSwitch = (i: number) => {
    setActiveDemo(i);
    setShowThinking(true);
    setTimeout(() => setShowThinking(false), 2000);
  };

  return (
    <section id="demo" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-400">
            <Code2 className="h-3.5 w-3.5" />
            Live Demo
          </div>
          <h2 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl">
            Watch INCLAW{" "}
            <span className="text-gradient-saffron">Think & Code</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-500">
            Click a language to see INCLAW&apos;s multi-step reasoning chain
            and the code it produces.
          </p>
        </motion.div>

        {/* Language tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {DEMO_CONVERSATIONS.map((demo, i) => (
            <button
              key={i}
              onClick={() => handleDemoSwitch(i)}
              className={`rounded-xl border px-5 py-2 text-sm font-medium transition-all ${
                activeDemo === i
                  ? "border-orange-500/60 bg-orange-500/12 text-orange-300 shadow-lg shadow-orange-500/10"
                  : "border-white/8 text-slate-500 hover:border-white/16 hover:text-white"
              }`}
            >
              {demo.language.charAt(0).toUpperCase() + demo.language.slice(1)}
            </button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-8 max-w-4xl"
        >
          {/* Thinking chain (shown briefly on switch) */}
          <AnimatePresence>
            {showThinking && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden rounded-xl border border-white/8 glass p-4"
              >
                <p className="mb-3 text-xs font-medium text-slate-500 uppercase tracking-widest">
                  🧠 INCLAW Reasoning Chain
                </p>
                <div className="flex flex-wrap gap-3">
                  {THINKING_CHAIN.map((step, i) => (
                    <motion.div
                      key={step.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: step.delay }}
                      className="flex items-center gap-2 rounded-lg bg-white/4 px-3 py-1.5 text-xs"
                    >
                      <step.icon className={`h-3.5 w-3.5 ${step.color}`} />
                      <span className="text-slate-400">{step.label}</span>
                      <span className="text-slate-600">{i < 3 ? "✓" : "..."}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main demo card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDemo}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden rounded-2xl border border-white/8 glass"
            >
              {/* Prompt bar */}
              <div className="flex items-start gap-3 border-b border-white/5 px-5 py-4">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                <p className="text-sm text-slate-300">{current.prompt}</p>
              </div>

              {/* Model + copy bar */}
              <div className="flex items-center justify-between border-b border-white/5 px-5 py-2">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Cpu className="h-3 w-3 text-cyan-400" />
                  <span className="text-cyan-400">{current.model}</span>
                  <span>· reasoning complete</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-600 transition-colors hover:text-white"
                >
                  {copied ? (
                    <><Check className="h-3 w-3 text-green-400" /> Copied</>
                  ) : (
                    <><Copy className="h-3 w-3" /> Copy</>
                  )}
                </button>
              </div>

              {/* Code output */}
              <div className="code-block max-h-[480px] overflow-auto">
                <SyntaxHighlighter
                  language={current.language}
                  style={nightOwl}
                  customStyle={{ background: "transparent", margin: 0, padding: "1.25rem", fontSize: "0.8rem" }}
                  showLineNumbers
                >
                  {current.response}
                </SyntaxHighlighter>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
