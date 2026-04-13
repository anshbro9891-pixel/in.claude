/**
 * model-router.js — Auto Model Selection for INCLAW
 *
 * Detects the task type from user message keywords and
 * automatically selects the best model for the job.
 *
 * Exports: detectTaskType, getModelForTask, MODEL_CONFIG
 */

/* ── Model Configuration ──────────────────────────────────── */
export const MODEL_CONFIG = {
  coding: {
    model: "deepseek-coder",
    label: "DeepSeek Coder",
    mode: "code mode",
    badgeClass: "coding",
  },
  reasoning: {
    model: "deepseek-r1",
    label: "DeepSeek R1",
    mode: "reasoning mode",
    badgeClass: "reasoning",
  },
  fast: {
    model: "llama-3.1-8b",
    label: "LLaMA 3.1 8B",
    mode: "fast mode",
    badgeClass: "fast",
  },
  chat: {
    model: "llama-3.3-70b",
    label: "LLaMA 3.3 70B",
    mode: "chat mode",
    badgeClass: "chat",
  },
};

/* ── Fallback Model ───────────────────────────────────────── */
export const FALLBACK_MODEL = "llama-3.1-8b";

/* ── Keyword Lists ────────────────────────────────────────── */
const CODING_KEYWORDS = [
  "code", "function", "bug", "error", "fix", "build", "api",
  "class", "python", "javascript", "js", "rust", "html", "css",
  "typescript", "sql", "database", "debug", "syntax", "import",
  "export", "async", "loop", "array",
];

const REASONING_KEYWORDS = [
  "why", "explain", "reason", "analyze", "compare",
  "difference", "how does", "think", "solve", "math",
  "calculate", "logic", "prove",
];

const FAST_KEYWORDS = [
  "quick", "short", "briefly", "simple", "one line",
  "just tell", "define", "what does", "meaning of",
];

/**
 * Detects the task type from the user's message.
 * Checks keywords against the lowercased message text.
 * Priority: coding > reasoning > fast > chat (default)
 *
 * @param {string} message — the user's input text
 * @returns {string} — one of "coding", "reasoning", "fast", "chat"
 */
export function detectTaskType(message) {
  const lower = message.toLowerCase();

  /* Check coding keywords first (highest priority) */
  for (const kw of CODING_KEYWORDS) {
    if (lower.includes(kw)) {
      return "coding";
    }
  }

  /* Check reasoning keywords */
  for (const kw of REASONING_KEYWORDS) {
    if (lower.includes(kw)) {
      return "reasoning";
    }
  }

  /* Check fast/short-answer keywords */
  for (const kw of FAST_KEYWORDS) {
    if (lower.includes(kw)) {
      return "fast";
    }
  }

  /* Default to general chat */
  return "chat";
}

/**
 * Gets the full model config for a given task type.
 *
 * @param {string} taskType — "coding" | "reasoning" | "fast" | "chat"
 * @returns {{ model: string, label: string, mode: string, badgeClass: string }}
 */
export function getModelForTask(taskType) {
  return MODEL_CONFIG[taskType] || MODEL_CONFIG.chat;
}
