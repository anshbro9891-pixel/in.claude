"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, Send, Trash2, Sparkles } from "lucide-react";
import InclawLogo from "@/components/InclawLogo";
import InclawWelcome from "@/components/InclawWelcome";
import { useInclawChat } from "@/hooks/useInclawChat";
import { SUPPORTED_MODELS } from "@/lib/constants";

const MODEL_LABELS = SUPPORTED_MODELS.reduce<Record<string, string>>((acc, model) => {
  acc[model.ollamaTag] = model.name;
  acc[model.id] = model.name;
  return acc;
}, {});

function ModelStatusBadge({ model, status }: { model: string | null; status: "online" | "offline" | "loading" }) {
  const color =
    status === "online" ? "bg-emerald-500" : status === "loading" ? "bg-amber-400" : "bg-rose-500";
  const label = model ? MODEL_LABELS[model] || model : "Auto-route";
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span className="font-semibold text-white">Answered by INCLAW</span>
      <span className="text-slate-400">· {label}</span>
    </div>
  );
}

function MessageBubble({ role, content, model }: { role: "user" | "assistant"; content: string; model?: string | null }) {
  const isUser = role === "user";
  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-3xl whitespace-pre-wrap rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-lg ${
          isUser
            ? "border-orange-500/30 bg-orange-500/10 text-white"
            : "border-white/10 bg-white/5 text-slate-200"
        }`}
      >
        {!isUser && model && (
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] uppercase tracking-widest text-orange-300">
            <Sparkles className="h-3 w-3 text-orange-400" /> {MODEL_LABELS[model] || model}
          </div>
        )}
        {content}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { messages, sendMessage, isLoading, currentModel, modelStatus, clearChat } = useInclawChat();
  const [input, setInput] = useState("");
  const showWelcome = messages.length === 0;

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const prompt = input;
    setInput("");
    await sendMessage(prompt, { autoRoute: true });
  };

  const latestAssistantModel = useMemo(() => {
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant" && m.modelUsed);
    return lastAssistant?.modelUsed || currentModel;
  }, [messages, currentModel]);

  return (
    <div className="flex min-h-screen flex-col bg-[#020010] text-white">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-[#020010]/80 px-6 py-4 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <InclawLogo size={28} />
          <div className="text-sm font-bold leading-tight">
            <div className="text-gradient-saffron">INC</div>
            <div className="text-gradient-cyan -mt-1">LAW</div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <ModelStatusBadge model={latestAssistantModel} status={modelStatus} />
          <button
            onClick={clearChat}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 hover:border-orange-500/40 hover:text-white"
          >
            Clear
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-28 pt-6">
        <InclawWelcome
          hidden={!showWelcome}
          onPromptSelect={(prompt) => {
            setInput("");
            sendMessage(prompt);
          }}
        />

        <div className="flex flex-1 flex-col gap-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} role={msg.role} content={msg.content} model={msg.modelUsed} />
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
              INCLAW is thinking...
            </div>
          )}
        </div>
      </main>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 border-t border-white/5 bg-[#020010]/95 p-4 backdrop-blur"
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Ask anything. INCLAW will remember your last questions.</span>
            <ModelStatusBadge model={latestAssistantModel} status={modelStatus} />
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 shadow-xl">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              placeholder="Type your prompt..."
              className="max-h-32 flex-1 resize-none bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-slate-600">
            <span>Open-Source · Made in India</span>
            <button
              type="button"
              onClick={clearChat}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-1 text-slate-400 transition hover:border-rose-500/30 hover:text-white"
            >
              <Trash2 className="h-3 w-3" /> reset memory
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
