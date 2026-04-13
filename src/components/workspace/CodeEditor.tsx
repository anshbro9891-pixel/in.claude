"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Save } from "lucide-react";

interface CodeEditorProps {
  code: string;
  language?: string;
  fileName?: string;
  onChange?: (code: string) => void;
  onSave?: (code: string) => void;
  readOnly?: boolean;
}

export default function CodeEditor({
  code,
  language = "typescript",
  fileName,
  onChange,
  onSave,
  readOnly = false,
}: CodeEditorProps) {
  const [value, setValue] = useState(code);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(code);
  }, [code]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  const handleSave = useCallback(() => {
    onSave?.(value);
  }, [value, onSave]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = value.substring(0, start) + "  " + value.substring(end);
        setValue(newValue);
        onChange?.(newValue);
        // Restore cursor position
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }, 0);
      }
    }
  };

  // Detect language from filename
  const langFromFile = (() => {
    if (!fileName) return language;
    const ext = fileName.split(".").pop()?.toLowerCase();
    const map: Record<string, string> = {
      ts: "typescript", tsx: "tsx", js: "javascript", jsx: "jsx",
      py: "python", rs: "rust", go: "go", java: "java",
      rb: "ruby", php: "php", html: "html", css: "css",
      json: "json", md: "markdown", sql: "sql", sh: "bash",
      yml: "yaml", yaml: "yaml", toml: "toml",
    };
    return map[ext || ""] || language;
  })();

  return (
    <div className="flex flex-col rounded-xl border border-white/10 bg-[#050012] overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          </div>
          {fileName && (
            <span className="ml-2 text-xs text-slate-500 font-mono">{fileName}</span>
          )}
          <span className="text-xs text-slate-700">({langFromFile})</span>
        </div>

        <div className="flex items-center gap-1">
          {onSave && (
            <button
              onClick={handleSave}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-500 hover:text-white transition"
              title="Save (Ctrl+S)"
            >
              <Save className="h-3 w-3" />
              Save
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-500 hover:text-white transition"
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
      </div>

      {/* Editor area */}
      <div className="relative">
        {!readOnly && isEditing ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              onChange?.(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsEditing(false)}
            className="w-full min-h-[200px] max-h-[500px] resize-y bg-transparent text-white font-mono text-sm p-4 outline-none"
            spellCheck={false}
            autoFocus
          />
        ) : (
          <div
            onClick={() => !readOnly && setIsEditing(true)}
            className={!readOnly ? "cursor-text" : ""}
          >
            <SyntaxHighlighter
              language={langFromFile}
              style={nightOwl}
              customStyle={{
                background: "transparent",
                margin: 0,
                padding: "1rem",
                fontSize: "0.825rem",
                minHeight: "200px",
                maxHeight: "500px",
                overflow: "auto",
              }}
              showLineNumbers
            >
              {value || "// Start coding here..."}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  );
}
