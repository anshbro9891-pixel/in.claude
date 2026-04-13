"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Send, Copy, Check, Trash2, ChevronDown, Sparkles, User,
  Cpu, ArrowLeft, Loader2, Brain, Search, Code2, Eye,
  PanelLeftOpen, PanelLeftClose, Plus, MessageSquare, Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SUPPORTED_MODELS, THINKING_STEPS } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import InclawLogo from "@/components/InclawLogo";

/* ── Types ─────────────────────────────────────────────────────────── */
interface ThinkingStep {
  label: string;
  status: "pending" | "active" | "done";
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  timestamp: Date;
  thinkingSteps?: ThinkingStep[];
  thinkingVisible?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  modelId: string;
}

/* ── Thinking step icons ──────────────────────────────────────────── */
const STEP_ICONS: Record<string, React.ElementType> = {
  [THINKING_STEPS.ANALYZING]:  Brain,
  [THINKING_STEPS.PLANNING]:   Zap,
  [THINKING_STEPS.SEARCHING]:  Search,
  [THINKING_STEPS.GENERATING]: Code2,
  [THINKING_STEPS.REVIEWING]:  Eye,
  [THINKING_STEPS.OPTIMIZING]: Sparkles,
};

/* ── Parse code blocks ────────────────────────────────────────────── */
function extractCodeBlocks(text: string): { type: "text" | "code"; content: string; language?: string }[] {
  const parts: { type: "text" | "code"; content: string; language?: string }[] = [];
  const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;
  while ((match = codeRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    parts.push({ type: "code", language: match[1] || "text", content: match[2].trim() });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push({ type: "text", content: text.slice(lastIndex) });
  return parts.length > 0 ? parts : [{ type: "text", content: text }];
}

/* ── Code block component ─────────────────────────────────────────── */
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="my-3 overflow-hidden rounded-xl border border-white/8 bg-[#050018]">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500/70" />
          <div className="h-2 w-2 rounded-full bg-yellow-500/70" />
          <div className="h-2 w-2 rounded-full bg-green-500/70" />
          <span className="ml-2 text-xs text-slate-600 font-mono">{language}</span>
        </div>
        <button onClick={handleCopy} className="flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-600 transition-colors hover:text-white">
          {copied ? <><Check className="h-3 w-3 text-green-400" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
        </button>
      </div>
      <SyntaxHighlighter language={language} style={nightOwl} customStyle={{ background: "transparent", margin: 0, padding: "1rem", fontSize: "0.8rem" }} showLineNumbers>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

/* ── Message content ──────────────────────────────────────────────── */
function MessageContent({ content }: { content: string }) {
  const parts = extractCodeBlocks(content);
  return (
    <div className="text-sm leading-relaxed">
      {parts.map((part, i) =>
        part.type === "code"
          ? <CodeBlock key={i} code={part.content} language={part.language || "text"} />
          : <span key={i} className="whitespace-pre-wrap text-slate-300">{part.content}</span>
      )}
    </div>
  );
}

/* ── Thinking chain display ───────────────────────────────────────── */
function ThinkingChain({ steps }: { steps: ThinkingStep[] }) {
  return (
    <div className="mb-3 rounded-xl border border-orange-500/15 bg-orange-500/5 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-orange-500/60">
        🧠 Reasoning Chain
      </p>
      <div className="flex flex-col gap-1.5">
        {steps.map((step, i) => {
          const Icon = STEP_ICONS[step.label] || Brain;
          return (
            <div key={i} className={`flex items-center gap-2 text-xs transition-all ${step.status === "done" ? "text-slate-500" : step.status === "active" ? "text-orange-300" : "text-slate-700"}`}>
              {step.status === "active" ? (
                <Loader2 className="h-3 w-3 animate-spin text-orange-400 shrink-0" />
              ) : step.status === "done" ? (
                <Check className="h-3 w-3 text-emerald-500 shrink-0" />
              ) : (
                <Icon className="h-3 w-3 shrink-0 opacity-30" />
              )}
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Suggestions ──────────────────────────────────────────────────── */
const WELCOME_SUGGESTIONS = [
  { text: "Write a Python function to merge two sorted linked lists",     category: "Algorithm" },
  { text: "Create a React hook for infinite scrolling with pagination",   category: "Frontend" },
  { text: "Implement a Redis-based sliding window rate limiter in Go",    category: "Backend" },
  { text: "Build a REST API with JWT auth and refresh tokens",            category: "API" },
  { text: "Design a PostgreSQL schema for a multi-tenant SaaS app",      category: "Database" },
  { text: "Write a Dockerfile for a Node.js app with health checks",      category: "DevOps" },
];

/* ── Main Chat component ──────────────────────────────────────────── */
export default function ChatPage() {
  const [messages, setMessages]             = useState<Message[]>([]);
  const [input, setInput]                   = useState("");
  const [isLoading, setIsLoading]           = useState(false);
  const [selectedModel, setSelectedModel]   = useState<string>(SUPPORTED_MODELS[0].id);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [sessions, setSessions]             = useState<ChatSession[]>([]);
  const [sessionId, setSessionId]           = useState<string | null>(null);
  const messagesEndRef  = useRef<HTMLDivElement>(null);
  const textareaRef     = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  /* Load sessions from Supabase */
  useEffect(() => {
    const loadSessions = async () => {
      if (!supabase) return;
      const { data } = await supabase
        .from("chat_sessions")
        .select("id, title, updated_at, model_id")
        .order("updated_at", { ascending: false })
        .limit(20);
      if (data) {
        setSessions(data.map((s) => ({
          id: s.id,
          title: s.title ?? "Untitled session",
          updatedAt: s.updated_at,
          modelId: s.model_id,
        })));
      }
    };
    loadSessions();
  }, []);

  /* Create/persist session */
  const ensureSession = useCallback(async (firstPrompt: string): Promise<string | null> => {
    if (sessionId) return sessionId;
    if (!supabase) return null;
    const { data } = await supabase
      .from("chat_sessions")
      .insert({ title: firstPrompt.slice(0, 60), model_id: selectedModel })
      .select("id")
      .single();
    const newId = data?.id ?? null;
    if (newId) setSessionId(newId);
    return newId;
  }, [sessionId, selectedModel]);

  /* Persist a message */
  const persistMessage = useCallback(async (sid: string, msg: Message) => {
    if (!supabase) return;
    await supabase.from("chat_messages").insert({
      session_id:     sid,
      role:           msg.role,
      content:        msg.content,
      model_id:       msg.model ?? null,
      thinking_steps: msg.thinkingSteps ?? null,
    });
  }, []);

  /* Animate thinking steps */
  const animateThinking = async (msgId: string): Promise<void> => {
    const steps = Object.values(THINKING_STEPS).map((label) => ({ label, status: "pending" as const }));

    const updateSteps = (updated: ThinkingStep[]) => {
      setMessages((prev) =>
        prev.map((m) => m.id === msgId ? { ...m, thinkingSteps: updated, thinkingVisible: true } : m)
      );
    };

    for (let i = 0; i < steps.length; i++) {
      steps[i] = { ...steps[i], status: "active" };
      updateSteps([...steps]);
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));
      steps[i] = { ...steps[i], status: "done" };
    }
    updateSteps([...steps]);
  };

  const handleSubmit = async (promptOverride?: string) => {
    const prompt = promptOverride || input.trim();
    if (!prompt || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };

    const thinkingMsgId = (Date.now() + 0.5).toString();
    const thinkingMsg: Message = {
      id: thinkingMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      thinkingSteps: Object.values(THINKING_STEPS).map((l) => ({ label: l, status: "pending" as const })),
      thinkingVisible: true,
    };

    setMessages((prev) => [...prev, userMsg, thinkingMsg]);
    setInput("");
    setIsLoading(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    /* Parallel: thinking animation + API call */
    const [, apiResult] = await Promise.all([
      animateThinking(thinkingMsgId),
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          model: selectedModel,
        }),
      })
        .then((r) => r.json())
        .catch(() => ({ content: "Sorry, an error occurred. Please try again." })),
    ]);

    const modelInfo = SUPPORTED_MODELS.find((m) => m.id === selectedModel);
    const finalSteps = Object.values(THINKING_STEPS).map((l) => ({ label: l, status: "done" as const }));

    setMessages((prev) =>
      prev.map((m) =>
        m.id === thinkingMsgId
          ? {
              ...m,
              content: apiResult.content,
              model: modelInfo?.name ?? selectedModel,
              thinkingSteps: finalSteps,
            }
          : m
      )
    );

    /* Persist to Supabase */
    const sid = await ensureSession(prompt);
    if (sid) {
      await persistMessage(sid, userMsg);
      await persistMessage(sid, { ...thinkingMsg, content: apiResult.content, model: modelInfo?.name });
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const clearChat = () => { setMessages([]); setSessionId(null); };

  const newChat = () => { clearChat(); setSidebarOpen(false); };

  const selectedModelInfo = SUPPORTED_MODELS.find((m) => m.id === selectedModel);

  return (
    <div className="flex h-screen bg-[#020010] overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-30 flex h-full w-72 flex-col border-r border-white/5 bg-[#030018]/95 backdrop-blur-2xl lg:relative lg:z-auto"
            >
              {/* Sidebar header */}
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                <Link href="/" className="flex items-center gap-2">
                  <InclawLogo size={24} />
                  <span className="text-sm font-bold">
                    <span className="text-gradient-saffron">INC</span>
                    <span className="text-gradient-cyan">LAW</span>
                  </span>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="rounded p-1 text-slate-600 hover:text-white">
                  <PanelLeftClose className="h-4 w-4" />
                </button>
              </div>

              {/* New chat */}
              <div className="p-3">
                <button
                  onClick={newChat}
                  className="flex w-full items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-sm text-slate-300 transition-all hover:border-orange-500/30 hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                  New Chat
                </button>
              </div>

              {/* Session list */}
              <div className="flex-1 overflow-y-auto px-3 pb-3">
                {sessions.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    <p className="mb-2 px-1 text-xs font-medium uppercase tracking-widest text-slate-700">
                      Recent
                    </p>
                    {sessions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => { setSessionId(s.id); setSidebarOpen(false); }}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition-all hover:bg-white/5 ${s.id === sessionId ? "bg-orange-500/10 text-orange-300" : "text-slate-500"}`}
                      >
                        <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{s.title}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-center text-xs text-slate-700">
                    {supabase ? "No sessions yet" : "Connect Supabase to save history"}
                  </p>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main chat area ──────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/5 bg-[#020010]/80 px-4 py-3 backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-white/5 hover:text-white"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
            <Link href="/" className="flex items-center gap-1.5 text-slate-500 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2">
              <InclawLogo size={28} animated />
              <div>
                <span className="text-sm font-bold">
                  <span className="text-gradient-saffron">INC</span>
                  <span className="text-gradient-cyan">LAW</span>
                </span>
                <span className="ml-2 text-xs text-slate-600">Agent v2</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Model picker */}
            <div className="relative">
              <button
                onClick={() => setShowModelPicker(!showModelPicker)}
                className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/4 px-3 py-1.5 text-xs text-slate-400 transition-all hover:border-white/16 hover:text-white"
              >
                <Cpu className="h-3 w-3 text-cyan-400" />
                <span className="hidden sm:inline">{selectedModelInfo?.name || "Model"}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              <AnimatePresence>
                {showModelPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    className="absolute right-0 top-full z-50 mt-2 w-76 overflow-hidden rounded-xl border border-white/8 bg-[#050025]/95 shadow-2xl backdrop-blur-2xl"
                  >
                    <div className="border-b border-white/5 px-4 py-2">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">
                        Select Model
                      </p>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {SUPPORTED_MODELS.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => { setSelectedModel(model.id); setShowModelPicker(false); }}
                          className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/4 ${selectedModel === model.id ? "bg-orange-500/8" : ""}`}
                        >
                          <Cpu className={`mt-0.5 h-4 w-4 shrink-0 ${selectedModel === model.id ? "text-orange-400" : "text-slate-600"}`} />
                          <div>
                            <p className="text-sm font-medium text-white">{model.name}</p>
                            <p className="text-xs text-slate-600">{model.provider} · {model.parameters}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={clearChat} className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-white/5 hover:text-white" title="Clear chat">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            /* Welcome */
            <div className="flex h-full flex-col items-center justify-center px-4 py-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-5 relative"
              >
                <InclawLogo size={64} animated />
                <div className="absolute inset-0 rounded-full bg-orange-500/15 blur-2xl animate-pulse-glow" />
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-2 text-2xl font-black text-white">
                Hello, I&apos;m INCLAW
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 max-w-md text-center text-sm text-slate-500">
                India&apos;s agentic AI. I plan, reason, and write production-grade code.
                Ask me anything — I&apos;ll show my thinking.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid w-full max-w-2xl gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {WELCOME_SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSubmit(s.text)}
                    className="group rounded-xl border border-white/6 bg-white/3 p-3.5 text-left transition-all hover:border-orange-500/25 hover:bg-orange-500/5"
                  >
                    <span className="mb-1.5 block text-xs font-semibold text-orange-500/60 uppercase tracking-wider">{s.category}</span>
                    <span className="text-xs leading-relaxed text-slate-400 group-hover:text-slate-300">{s.text}</span>
                  </button>
                ))}
              </motion.div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl px-4 py-6">
              {messages.map((message) => (
                <div key={message.id} className="mb-6 animate-fade-up">
                  {/* Role header */}
                  <div className="mb-2 flex items-center gap-2">
                    {message.role === "user" ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-700">
                        <User className="h-3.5 w-3.5 text-slate-300" />
                      </div>
                    ) : (
                      <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                        <InclawLogo size={24} />
                      </div>
                    )}
                    <span className="text-xs font-semibold text-slate-500">
                      {message.role === "user" ? "You" : "INCLAW"}
                    </span>
                    {message.model && (
                      <span className="text-xs text-slate-700">· {message.model}</span>
                    )}
                  </div>

                  {/* Message body */}
                  <div className="pl-8">
                    {/* Thinking chain */}
                    {message.role === "assistant" && message.thinkingVisible && message.thinkingSteps && message.thinkingSteps.length > 0 && (
                      <ThinkingChain steps={message.thinkingSteps} />
                    )}

                    {/* Content or loader */}
                    {message.content ? (
                      <MessageContent content={message.content} />
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-orange-400" />
                        Reasoning...
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-white/5 bg-[#020010]/80 px-4 py-4 backdrop-blur-2xl">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-3 rounded-2xl border border-white/8 bg-white/3 px-4 py-3 transition-all focus-within:border-orange-500/40 focus-within:bg-orange-500/3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask INCLAW to think, code, debug, or explain..."
                className="max-h-[200px] min-h-[24px] flex-1 resize-none bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={() => handleSubmit()}
                disabled={!input.trim() || isLoading}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-500/20 transition-all hover:shadow-orange-500/30 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isLoading
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Send className="h-3.5 w-3.5" />
                }
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-slate-700">
              INCLAW uses open-source LLMs. Responses may not always be accurate.{" "}
              {!supabase && <span className="text-orange-600/60">Add Supabase env vars to enable chat history.</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
