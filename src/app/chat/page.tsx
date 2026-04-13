"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Terminal,
  Send,
  Copy,
  Check,
  Trash2,
  ChevronDown,
  Sparkles,
  User,
  Cpu,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { SUPPORTED_MODELS } from "@/lib/constants";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  timestamp: Date;
}

function extractCodeBlocks(
  text: string
): { type: "text" | "code"; content: string; language?: string }[] {
  const parts: { type: "text" | "code"; content: string; language?: string }[] =
    [];
  const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    parts.push({
      type: "code",
      language: match[1] || "text",
      content: match[2].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: "text", content: text }];
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-white/10 bg-[#011627]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-xs text-slate-400">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-slate-500 transition-colors hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-400" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> Copy
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={nightOwl}
        customStyle={{
          background: "transparent",
          margin: 0,
          padding: "1rem",
          fontSize: "0.8125rem",
        }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  const parts = extractCodeBlocks(content);

  return (
    <div className="prose prose-invert max-w-none text-sm leading-relaxed">
      {parts.map((part, i) =>
        part.type === "code" ? (
          <CodeBlock
            key={i}
            code={part.content}
            language={part.language || "text"}
          />
        ) : (
          <span key={i} className="whitespace-pre-wrap">
            {part.content}
          </span>
        )
      )}
    </div>
  );
}

const WELCOME_SUGGESTIONS = [
  "Write a Python function to merge two sorted linked lists",
  "Create a React hook for infinite scrolling",
  "Implement a Redis-based rate limiter in Go",
  "Build a REST API with authentication in Express.js",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(SUPPORTED_MODELS[0].id);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = async (promptOverride?: string) => {
    const prompt = promptOverride || input.trim();
    if (!prompt || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Auto-resize textarea back
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const response = await fetch("/api/chat", {
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

      const data = await response.json();

      const modelInfo = SUPPORTED_MODELS.find((m) => m.id === selectedModel);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        model: modelInfo?.name || selectedModel,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error. Please check your connection and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const selectedModelInfo = SUPPORTED_MODELS.find(
    (m) => m.id === selectedModel
  );

  return (
    <div className="flex h-screen flex-col bg-[#030014]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/5 bg-[#030014]/80 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-cyan-500">
              <Terminal className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold">
                <span className="text-orange-400">INC</span>
                <span className="text-cyan-400">LAW</span>
              </span>
              <span className="ml-2 text-xs text-slate-500">AI Agent</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Model picker */}
          <div className="relative">
            <button
              onClick={() => setShowModelPicker(!showModelPicker)}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition-all hover:border-white/20"
            >
              <Cpu className="h-3 w-3 text-cyan-400" />
              {selectedModelInfo?.name || "Select Model"}
              <ChevronDown className="h-3 w-3" />
            </button>

            {showModelPicker && (
              <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-white/10 bg-[#0a0625] shadow-xl">
                {SUPPORTED_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model.id);
                      setShowModelPicker(false);
                    }}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5 ${
                      selectedModel === model.id ? "bg-orange-500/10" : ""
                    }`}
                  >
                    <Cpu
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        selectedModel === model.id
                          ? "text-orange-400"
                          : "text-slate-500"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {model.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {model.provider} • {model.parameters}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={clearChat}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
            title="Clear chat"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          /* Welcome screen */
          <div className="flex h-full flex-col items-center justify-center px-4">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-cyan-500 shadow-lg shadow-orange-500/25">
              <Terminal className="h-8 w-8 text-white" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-white">
              Welcome to INCLAW
            </h2>
            <p className="mb-8 max-w-md text-center text-sm text-slate-400">
              India&apos;s open-source AI coding agent. Ask me to write, debug,
              explain, or optimize any code.
            </p>

            <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
              {WELCOME_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSubmit(suggestion)}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 text-left text-sm text-slate-300 transition-all hover:border-orange-500/30 hover:bg-orange-500/5 hover:text-white"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl px-4 py-6">
            {messages.map((message) => (
              <div key={message.id} className="mb-6">
                <div className="mb-2 flex items-center gap-2">
                  {message.role === "user" ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-700">
                      <User className="h-3.5 w-3.5 text-slate-300" />
                    </div>
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-orange-500 to-cyan-500">
                      <Sparkles className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                  <span className="text-xs font-medium text-slate-400">
                    {message.role === "user" ? "You" : "INCLAW"}
                  </span>
                  {message.model && (
                    <span className="text-xs text-slate-600">
                      via {message.model}
                    </span>
                  )}
                </div>

                <div className="pl-8">
                  <MessageContent content={message.content} />
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="mb-6">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-orange-500 to-cyan-500">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-slate-400">
                    INCLAW
                  </span>
                </div>
                <div className="pl-8">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
                    Thinking...
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-white/5 bg-[#030014]/80 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition-all focus-within:border-orange-500/50">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto resize
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 200) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask INCLAW to write, debug, or explain code..."
              className="max-h-[200px] min-h-[24px] flex-1 resize-none bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isLoading}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white transition-all hover:from-orange-400 hover:to-orange-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-slate-600">
            INCLAW uses open-source LLMs. Responses may not always be accurate. 
            Currently running in demo mode.
          </p>
        </div>
      </div>
    </div>
  );
}
