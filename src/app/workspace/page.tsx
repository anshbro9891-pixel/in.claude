"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Send,
  ArrowLeft,
  Loader2,
  Terminal as TermIcon,
  Globe,
  Code2,
  FolderTree,
  Sparkles,
  Play,
  Hammer,
  Rocket,
  Settings,
  PanelLeftOpen,
  PanelLeftClose,
  Bot,
  Zap,
  Brain,
  Search,
  Eye,
  ChevronDown,
  Plus,
  Copy,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";

import { SUPPORTED_MODELS, THINKING_STEPS } from "@/lib/constants";
import { PROJECT_TEMPLATES } from "@/lib/agent/sandbox";
import InclawLogo from "@/components/InclawLogo";
import FileExplorer, { buildFileTree } from "@/components/workspace/FileExplorer";
import Terminal from "@/components/workspace/Terminal";
import BrowserPreview from "@/components/workspace/BrowserPreview";
import CodeEditor from "@/components/workspace/CodeEditor";
import PermissionDialog from "@/components/workspace/PermissionDialog";

/* ── Types ─────────────────────────────────────────────────────────── */
interface WorkspaceFile {
  path: string;
  content: string;
  language?: string;
}

interface ThinkingStep {
  label: string;
  status: "pending" | "active" | "done";
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  thinkingSteps?: ThinkingStep[];
  thinkingVisible?: boolean;
}

interface PermissionRequestState {
  open: boolean;
  action: string;
  category: string;
  description: string;
  risk: "low" | "medium" | "high";
  resolve?: (granted: boolean) => void;
}

/* ── Panel type ───────────────────────────────────────────────────── */
type RightPanel = "preview" | "terminal" | "none";

/* ── Thinking step icons ──────────────────────────────────────────── */
const STEP_ICONS: Record<string, React.ElementType> = {
  [THINKING_STEPS.ANALYZING]: Brain,
  [THINKING_STEPS.PLANNING]: Zap,
  [THINKING_STEPS.SEARCHING]: Search,
  [THINKING_STEPS.GENERATING]: Code2,
  [THINKING_STEPS.REVIEWING]: Eye,
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
function InlineCodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="my-2 overflow-hidden rounded-lg border border-white/8 bg-[#050018]">
      <div className="flex items-center justify-between border-b border-white/5 px-3 py-1.5">
        <span className="text-xs text-slate-600 font-mono">{language}</span>
        <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-slate-600 hover:text-white transition">
          {copied ? <><Check className="h-3 w-3 text-green-400" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
        </button>
      </div>
      <SyntaxHighlighter language={language} style={nightOwl} customStyle={{ background: "transparent", margin: 0, padding: "0.75rem", fontSize: "0.75rem" }} showLineNumbers>
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
        part.type === "code" ? (
          <InlineCodeBlock key={i} code={part.content} language={part.language || "text"} />
        ) : (
          <p key={i} className="whitespace-pre-wrap">{part.content}</p>
        )
      )}
    </div>
  );
}

/* ── Main Workspace Page ──────────────────────────────────────────── */
export default function WorkspacePage() {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(SUPPORTED_MODELS[5].id); // qwen2.5-coder
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [rightPanel, setRightPanel] = useState<RightPanel>("none");
  const [showTerminal, setShowTerminal] = useState(false);

  // Project state
  const [projectFiles, setProjectFiles] = useState<WorkspaceFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | undefined>();
  const [projectTemplate, setProjectTemplate] = useState<string>("nextjs");

  // Permission state
  const [permissionRequest, setPermissionRequest] = useState<PermissionRequestState>({
    open: false,
    action: "",
    category: "",
    description: "",
    risk: "medium",
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Get current file content
  const currentFile = projectFiles.find((f) => f.path === selectedFile);

  // Create project from template
  const createProject = useCallback((template: string) => {
    const tmpl = PROJECT_TEMPLATES[template];
    if (!tmpl) return;

    const files: WorkspaceFile[] = tmpl.files.map((f) => ({
      path: f.path,
      content: f.content,
      language: f.language,
    }));

    setProjectFiles(files);
    setProjectTemplate(template);
    if (files.length > 0) {
      setSelectedFile(files[0].path);
    }
  }, []);

  // Handle file save
  const handleFileSave = useCallback(
    (path: string, content: string) => {
      setProjectFiles((prev) =>
        prev.map((f) => (f.path === path ? { ...f, content } : f))
      );
    },
    []
  );

  // Send message
  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Add thinking message
    const thinkingSteps: ThinkingStep[] = Object.values(THINKING_STEPS).map((label) => ({
      label,
      status: "pending" as const,
    }));

    const assistantId = `msg_${Date.now() + 1}`;
    const thinkingMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      thinkingSteps,
      thinkingVisible: true,
    };

    setMessages((prev) => [...prev, thinkingMessage]);

    // Animate thinking steps
    for (let i = 0; i < thinkingSteps.length; i++) {
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                thinkingSteps: m.thinkingSteps?.map((s, j) => ({
                  ...s,
                  status: j < i ? "done" : j === i ? "active" : "pending",
                })),
              }
            : m
        )
      );
    }

    // Mark all done
    await new Promise((r) => setTimeout(r, 300));
    setMessages((prev) =>
      prev.map((m) =>
        m.id === assistantId
          ? {
              ...m,
              thinkingSteps: m.thinkingSteps?.map((s) => ({
                ...s,
                status: "done" as const,
              })),
            }
          : m
      )
    );

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel,
        }),
      });

      const data = await res.json();

      // Check if response contains project files
      const codeBlocks = extractCodeBlocks(data.content || "");
      const newFiles: WorkspaceFile[] = [];

      for (const block of codeBlocks) {
        if (block.type === "code" && block.language) {
          // Try to extract filename from comment
          const firstLine = block.content.split("\n")[0];
          const pathMatch = firstLine.match(/\/\/\s*(src\/\S+|[\w/]+\.\w+)/);
          if (pathMatch) {
            newFiles.push({
              path: pathMatch[1],
              content: block.content,
              language: block.language,
            });
          }
        }
      }

      // If we got new files, add them to the project
      if (newFiles.length > 0) {
        setProjectFiles((prev) => {
          const updated = [...prev];
          for (const nf of newFiles) {
            const existing = updated.findIndex((f) => f.path === nf.path);
            if (existing >= 0) {
              updated[existing] = nf;
            } else {
              updated.push(nf);
            }
          }
          return updated;
        });
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: data.content || "I encountered an issue. Please try again.",
                thinkingVisible: false,
              }
            : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: "Connection error. Make sure the server is running.",
                thinkingVisible: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, selectedModel]);

  // Keyboard handling
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // File tree data
  const fileTree = buildFileTree(projectFiles.map((f) => f.path));
  const modelInfo = SUPPORTED_MODELS.find((m) => m.id === selectedModel);

  // Suggested actions
  const suggestions = [
    { icon: Rocket, label: "Build a Next.js app", prompt: "Build me a full-stack Next.js app with Tailwind CSS, user authentication, and a dashboard" },
    { icon: Globe, label: "Create a landing page", prompt: "Create a beautiful responsive landing page with hero section, features, pricing, and footer" },
    { icon: Code2, label: "Build REST API", prompt: "Build a production-ready REST API with Express.js, JWT auth, rate limiting, and CRUD operations" },
    { icon: Hammer, label: "Create React component", prompt: "Create a reusable React component library with Button, Card, Modal, and Toast components" },
  ];

  return (
    <div className="flex h-screen bg-[#020010] text-white overflow-hidden">
      {/* Left Sidebar — File Explorer */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex flex-col border-r border-white/5 bg-[#0a0a1a] overflow-hidden"
          >
            {/* Logo header */}
            <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
              <Link href="/" className="flex items-center gap-2">
                <InclawLogo size={24} />
                <span className="font-bold text-sm">INCLAW</span>
              </Link>
              <span className="ml-auto text-[10px] text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded-full">
                Workspace
              </span>
            </div>

            {/* Project template selector */}
            <div className="border-b border-white/5 p-3">
              <label className="text-xs text-slate-500 mb-1 block">Project Template</label>
              <div className="flex flex-wrap gap-1">
                {Object.keys(PROJECT_TEMPLATES).slice(0, 5).map((tmpl) => (
                  <button
                    key={tmpl}
                    onClick={() => createProject(tmpl)}
                    className={`text-xs px-2 py-1 rounded-md border transition ${
                      projectTemplate === tmpl && projectFiles.length > 0
                        ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                        : "border-white/10 text-slate-500 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {tmpl}
                  </button>
                ))}
              </div>
            </div>

            {/* File explorer */}
            <div className="flex-1 overflow-hidden">
              <FileExplorer
                files={fileTree}
                selectedFile={selectedFile}
                onSelectFile={setSelectedFile}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top toolbar */}
        <div className="flex items-center gap-2 border-b border-white/5 bg-[#0a0a1a]/80 px-4 py-2">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-1.5 text-slate-500 hover:text-white transition"
          >
            {showSidebar ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </button>

          <div className="h-4 w-px bg-white/10" />

          {/* Model selector */}
          <div className="relative">
            <button
              onClick={() => setShowModelPicker(!showModelPicker)}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm hover:border-white/20 transition"
            >
              <Bot className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-slate-300">{modelInfo?.name || "Select Model"}</span>
              <ChevronDown className="h-3 w-3 text-slate-500" />
            </button>

            <AnimatePresence>
              {showModelPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute left-0 top-full mt-1 z-50 w-72 rounded-xl border border-white/10 bg-[#0a0a1a] p-2 shadow-2xl"
                >
                  {SUPPORTED_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model.id);
                        setShowModelPicker(false);
                      }}
                      className={`w-full flex items-start gap-3 rounded-lg px-3 py-2 text-left transition ${
                        selectedModel === model.id
                          ? "bg-cyan-500/10 text-white"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        <div className={`h-2 w-2 rounded-full bg-${model.color}-400`} />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{model.name}</div>
                        <div className="text-xs text-slate-500">{model.provider} · {model.parameters}</div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1" />

          {/* Right panel toggles */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setRightPanel(rightPanel === "preview" ? "none" : "preview")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition ${
                rightPanel === "preview"
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                  : "text-slate-500 hover:text-white border border-transparent"
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              Preview
            </button>
            <button
              onClick={() => setShowTerminal(!showTerminal)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition ${
                showTerminal
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                  : "text-slate-500 hover:text-white border border-transparent"
              }`}
            >
              <TermIcon className="h-3.5 w-3.5" />
              Terminal
            </button>

            <div className="h-4 w-px bg-white/10 mx-1" />

            <Link
              href="/chat"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-slate-500 hover:text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Chat
            </Link>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Center: Code Editor or Chat */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Code editor (when a file is selected) */}
            {selectedFile && currentFile && (
              <div className="border-b border-white/5 max-h-[40%] overflow-auto">
                <CodeEditor
                  code={currentFile.content}
                  language={currentFile.language}
                  fileName={currentFile.path}
                  onSave={(content) => handleFileSave(currentFile.path, content)}
                />
              </div>
            )}

            {/* Chat messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <InclawLogo size={48} />
                  <h2 className="mt-4 text-xl font-bold">INCLAW Workspace</h2>
                  <p className="mt-1 text-sm text-slate-500 text-center max-w-md">
                    Build full-stack apps, websites, and APIs. INCLAW writes code, runs it in a sandbox, and shows you a live preview.
                  </p>

                  {/* Quick actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 w-full max-w-lg">
                    {suggestions.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => {
                          setInput(s.prompt);
                          inputRef.current?.focus();
                        }}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left hover:border-cyan-500/30 hover:bg-cyan-500/5 transition group"
                      >
                        <s.icon className="h-5 w-5 text-slate-500 group-hover:text-cyan-400 shrink-0 transition" />
                        <span className="text-sm text-slate-400 group-hover:text-white transition">
                          {s.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Quick project create */}
                  <div className="mt-6 flex items-center gap-2">
                    <span className="text-xs text-slate-600">Quick start:</span>
                    {["nextjs", "react", "express", "static-html"].map((tmpl) => (
                      <button
                        key={tmpl}
                        onClick={() => createProject(tmpl)}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-white/10 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 transition"
                      >
                        <Plus className="h-3 w-3" />
                        {tmpl}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-w-3xl mx-auto">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="shrink-0 mt-1">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
                            <Bot className="h-4 w-4 text-cyan-400" />
                          </div>
                        </div>
                      )}

                      <div className={`max-w-[85%] ${msg.role === "user" ? "order-first" : ""}`}>
                        {/* Thinking steps */}
                        {msg.thinkingVisible && msg.thinkingSteps && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mb-2 rounded-lg border border-white/5 bg-white/[0.02] p-3"
                          >
                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                              <Brain className="h-3 w-3" />
                              <span>Thinking...</span>
                            </div>
                            <div className="space-y-1">
                              {msg.thinkingSteps.map((step, i) => {
                                const Icon = STEP_ICONS[step.label] || Sparkles;
                                return (
                                  <div key={i} className="flex items-center gap-2 text-xs">
                                    {step.status === "active" ? (
                                      <Loader2 className="h-3 w-3 text-cyan-400 animate-spin" />
                                    ) : step.status === "done" ? (
                                      <Icon className="h-3 w-3 text-green-400" />
                                    ) : (
                                      <div className="h-3 w-3 rounded-full border border-white/20" />
                                    )}
                                    <span className={step.status === "active" ? "text-cyan-400" : step.status === "done" ? "text-slate-400" : "text-slate-600"}>
                                      {step.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}

                        {/* Message content */}
                        {msg.content && (
                          <div
                            className={`rounded-xl px-4 py-3 ${
                              msg.role === "user"
                                ? "bg-cyan-500/10 border border-cyan-500/20 text-white"
                                : "bg-white/[0.03] border border-white/5 text-slate-300"
                            }`}
                          >
                            <MessageContent content={msg.content} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && messages[messages.length - 1]?.content === "" && (
                    <div className="flex items-center gap-2 text-slate-500 text-sm ml-10">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      INCLAW is working...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="border-t border-white/5 bg-[#0a0a1a]/50 p-4">
              <div className="max-w-3xl mx-auto flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask INCLAW to build something... (Shift+Enter for new line)"
                    rows={1}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 resize-none"
                    style={{ minHeight: "44px", maxHeight: "160px" }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height = Math.min(target.scrollHeight, 160) + "px";
                    }}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="shrink-0 flex items-center justify-center h-11 w-11 rounded-xl bg-cyan-500 text-white hover:bg-cyan-400 disabled:opacity-30 disabled:hover:bg-cyan-500 transition"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-2 text-center">
                <span className="text-[10px] text-slate-600">
                  INCLAW v2.0 · Powered by {modelInfo?.name || "Open Source Models"} · {modelInfo?.parameters || "32B"} parameters
                </span>
              </div>
            </div>
          </div>

          {/* Right panel: Preview or Terminal */}
          <AnimatePresence>
            {rightPanel !== "none" && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "40%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="border-l border-white/5 overflow-hidden"
              >
                {rightPanel === "preview" && (
                  <BrowserPreview
                    html={projectFiles.find((f) => f.path === "index.html" || f.path === "src/app/page.tsx")?.content}
                    onClose={() => setRightPanel("none")}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom: Terminal */}
        <AnimatePresence>
          {showTerminal && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 250, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/5"
            >
              <Terminal onClose={() => setShowTerminal(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Permission dialog */}
      <PermissionDialog
        open={permissionRequest.open}
        action={permissionRequest.action}
        category={permissionRequest.category}
        description={permissionRequest.description}
        risk={permissionRequest.risk}
        onGrant={() => permissionRequest.resolve?.(true)}
        onDeny={() => permissionRequest.resolve?.(false)}
        onClose={() => setPermissionRequest((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
