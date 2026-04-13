"use client";

import { useState } from "react";
import { Globe, ExternalLink, RefreshCw, ArrowLeft, ArrowRight, X } from "lucide-react";

interface BrowserPreviewProps {
  url?: string;
  html?: string;
  title?: string;
  onClose?: () => void;
  onNavigate?: (url: string) => void;
}

export default function BrowserPreview({
  url: initialUrl,
  html,
  title = "INCLAW Preview",
  onClose,
  onNavigate,
}: BrowserPreviewProps) {
  const [, setCurrentUrl] = useState(initialUrl || "about:blank");
  const [inputUrl, setInputUrl] = useState(initialUrl || "");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(initialUrl ? [initialUrl] : []);
  const [historyIndex, setHistoryIndex] = useState(0);

  const navigate = (newUrl: string) => {
    setCurrentUrl(newUrl);
    setInputUrl(newUrl);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);

    const newHistory = [...history.slice(0, historyIndex + 1), newUrl];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    onNavigate?.(newUrl);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
    }
  };

  const refresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  // Create srcdoc content for HTML preview
  const previewContent = html
    ? html
    : `<!DOCTYPE html>
<html>
<head><style>
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0a; color: #fff; font-family: system-ui; }
  .container { text-align: center; }
  h1 { font-size: 2rem; margin-bottom: 0.5rem; background: linear-gradient(135deg, #06b6d4, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  p { color: #666; }
</style></head>
<body>
  <div class="container">
    <h1>⚡ INCLAW Preview</h1>
    <p>Your application will appear here</p>
    <p style="margin-top: 1rem; font-size: 0.85rem; color: #444;">Build a project to see the live preview</p>
  </div>
</body>
</html>`;

  return (
    <div className="flex flex-col rounded-xl border border-white/10 bg-[#050012] overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.02] px-3 py-2">
        <div className="flex gap-1.5">
          <button
            onClick={onClose}
            className="h-3 w-3 rounded-full bg-red-500/70 hover:bg-red-500 transition"
          />
          <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <div className="h-3 w-3 rounded-full bg-green-500/70" />
        </div>

        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={goBack}
            disabled={historyIndex <= 0}
            className="p-1 text-slate-600 hover:text-white transition disabled:opacity-30"
          >
            <ArrowLeft className="h-3 w-3" />
          </button>
          <button
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            className="p-1 text-slate-600 hover:text-white transition disabled:opacity-30"
          >
            <ArrowRight className="h-3 w-3" />
          </button>
          <button
            onClick={refresh}
            className="p-1 text-slate-600 hover:text-white transition"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* URL bar */}
        <div className="flex-1 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1 mx-2">
          <Globe className="h-3 w-3 text-slate-500 shrink-0" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && navigate(inputUrl)}
            className="flex-1 bg-transparent text-xs text-slate-400 outline-none font-mono"
            placeholder="Enter URL or build a project..."
          />
          {isLoading && (
            <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
          )}
        </div>

        <div className="flex items-center gap-1">
          <button className="p-1 text-slate-600 hover:text-white transition">
            <ExternalLink className="h-3 w-3" />
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

      {/* Preview area */}
      <div className="relative min-h-[300px] max-h-[500px] bg-white">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0a0a0a]">
            <div className="flex items-center gap-2 text-slate-500">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        )}
        <iframe
          srcDoc={previewContent}
          sandbox="allow-scripts allow-same-origin"
          className="h-full w-full min-h-[300px] border-0"
          title={title}
        />
      </div>
    </div>
  );
}
