"use client";

import { useState } from "react";
import InclawLogo from "./InclawLogo";

const STARTER_PROMPTS = [
  "Build me a React todo app",
  "Debug this Python error",
  "Explain how transformers work",
  "Write a REST API in Node.js",
  "Help me with system design",
  "Write unit tests for my code",
];

interface Props {
  onPromptSelect: (prompt: string) => void;
  hidden?: boolean;
}

export default function InclawWelcome({ onPromptSelect, hidden }: Props) {
  const [dismissed, setDismissed] = useState(false);
  if (hidden || dismissed) return null;

  const handleSelect = (prompt: string) => {
    setDismissed(true);
    onPromptSelect(prompt);
  };

  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b0820] via-[#0a0414] to-[#050018] p-6 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10">
          <InclawLogo size={28} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-orange-400/70">Welcome to INCLAW</p>
          <h2 className="text-xl font-bold text-white">India&apos;s open-source agentic AI</h2>
          <p className="text-sm text-slate-400">
            Pick a starter prompt or type anything. INCLAW will auto-pick the best model and stream answers.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {STARTER_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSelect(prompt)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 transition hover:border-orange-500/50 hover:text-white"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
