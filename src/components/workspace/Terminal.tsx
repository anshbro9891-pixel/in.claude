"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal as TermIcon, X, Minimize2, Maximize2 } from "lucide-react";

interface TerminalLine {
  type: "input" | "output" | "error" | "system";
  content: string;
  timestamp: number;
}

interface TerminalProps {
  onCommand?: (command: string) => Promise<string>;
  initialLines?: TerminalLine[];
  title?: string;
  onClose?: () => void;
}

export default function Terminal({
  onCommand,
  initialLines = [],
  title = "INCLAW Terminal",
  onClose,
}: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: "system",
      content: "INCLAW Terminal v2.0 — Type commands or ask INCLAW to execute them",
      timestamp: Date.now(),
    },
    ...initialLines,
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const executeCommand = async (cmd: string) => {
    if (!cmd.trim()) return;

    // Add input line
    setLines((prev) => [...prev, { type: "input", content: `$ ${cmd}`, timestamp: Date.now() }]);
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInput("");
    setIsProcessing(true);

    try {
      if (onCommand) {
        const output = await onCommand(cmd);
        setLines((prev) => [...prev, { type: "output", content: output, timestamp: Date.now() }]);
      } else {
        // Simulate common commands
        const output = simulateCommand(cmd);
        setLines((prev) => [...prev, { type: output.startsWith("Error") ? "error" : "output", content: output, timestamp: Date.now() }]);
      }
    } catch (err) {
      setLines((prev) => [
        ...prev,
        { type: "error", content: `Error: ${err instanceof Error ? err.message : "Command failed"}`, timestamp: Date.now() },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([{ type: "system", content: "Terminal cleared", timestamp: Date.now() }]);
    }
  };

  if (isMinimized) {
    return (
      <div
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0a0a1a] px-3 py-2 cursor-pointer hover:border-cyan-500/50 transition"
        onClick={() => setIsMinimized(false)}
      >
        <TermIcon className="h-4 w-4 text-cyan-400" />
        <span className="text-sm text-slate-400">{title}</span>
        <Maximize2 className="h-3 w-3 text-slate-500 ml-auto" />
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-white/10 bg-[#050012] overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <button
              onClick={onClose}
              className="h-3 w-3 rounded-full bg-red-500/70 hover:bg-red-500 transition"
            />
            <button
              onClick={() => setIsMinimized(true)}
              className="h-3 w-3 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition"
            />
            <div className="h-3 w-3 rounded-full bg-green-500/70" />
          </div>
          <span className="ml-2 text-xs text-slate-500 font-mono">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 text-slate-600 hover:text-white transition"
          >
            <Minimize2 className="h-3 w-3" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-slate-600 hover:text-red-400 transition"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Output area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm min-h-[200px] max-h-[400px]"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap mb-0.5 ${
              line.type === "input"
                ? "text-cyan-400"
                : line.type === "error"
                ? "text-red-400"
                : line.type === "system"
                ? "text-slate-600 italic"
                : "text-slate-300"
            }`}
          >
            {line.content}
          </div>
        ))}

        {isProcessing && (
          <div className="text-slate-500 animate-pulse">Processing...</div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-white/5 px-4 py-2">
        <span className="text-cyan-500 font-mono text-sm">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command..."
          className="flex-1 bg-transparent text-sm text-white font-mono outline-none placeholder:text-slate-600"
          disabled={isProcessing}
          autoFocus
        />
      </div>
    </div>
  );
}

function simulateCommand(cmd: string): string {
  const parts = cmd.trim().split(/\s+/);
  const command = parts[0];

  switch (command) {
    case "ls":
      return "package.json  src/  public/  node_modules/  tsconfig.json  next.config.ts";
    case "pwd":
      return "/workspace/inclaw-app";
    case "echo":
      return parts.slice(1).join(" ");
    case "node":
      if (parts[1] === "-v") return "v20.11.0";
      return "Node.js REPL (simulated)";
    case "npm":
      if (parts[1] === "-v") return "10.2.4";
      if (parts[1] === "run" && parts[2] === "dev") return "▲ Next.js dev server started on http://localhost:3000";
      if (parts[1] === "run" && parts[2] === "build") return "✓ Build completed successfully";
      if (parts[1] === "install") return `Added ${Math.floor(Math.random() * 50) + 10} packages in ${(Math.random() * 5 + 1).toFixed(1)}s`;
      return "npm: command options - install, run, test, build";
    case "python":
    case "python3":
      if (parts[1] === "--version") return "Python 3.12.1";
      return "Python REPL (simulated)";
    case "git":
      if (parts[1] === "status") return "On branch main\nnothing to commit, working tree clean";
      if (parts[1] === "log") return "abc1234 feat: initial INCLAW setup\ndef5678 chore: add dependencies";
      return "git: command options - status, log, add, commit, push";
    case "clear":
      return "";
    case "help":
      return `INCLAW Terminal — Available commands:
  ls, pwd, echo, node, npm, python, git, clear, help
  
For full command execution, connect to a real sandbox environment.`;
    default:
      return `${command}: command simulated. Connect to Ollama + sandbox for real execution.`;
  }
}
