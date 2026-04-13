/**
 * INCLAW LLM Routing Library
 *
 * Multi-backend router that tries inference backends in priority order:
 *   1. Ollama  (local, zero-cost)
 *   2. HuggingFace Inference API  (cloud, free tier available)
 *   3. OpenAI-compatible endpoint  (vLLM / TGI / Together AI / Replicate)
 *   4. Demo fallback  (pattern-matched responses, no LLM required)
 *
 * Configuration is via environment variables — see .env.example.
 */

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMResponse {
  content: string;
  model: string;
  backend: "ollama" | "huggingface" | "openai_compatible" | "demo";
  promptTokens?: number;
  completionTokens?: number;
}

/* ─────────────────────────────────────────────────────────────────────────
   Model ID → backend model tag mapping
───────────────────────────────────────────────────────────────────────── */
const OLLAMA_TAGS: Record<string, string> = {
  "codellama-34b":      "codellama:34b",
  "deepseek-coder-33b": "deepseek-coder:33b",
  "starcoder2-15b":     "starcoder2:15b",
  "mixtral-8x7b":       "mixtral:8x7b",
  "llama3-70b":         "llama3:70b",
  "qwen2.5-coder-32b":  "qwen2.5-coder:32b",
  "gemma3-27b":         "gemma3:27b",
  "phi4-14b":           "phi4:14b",
  "llama3.3-70b":       "llama3.3:70b",
};

const HF_MODEL_IDS: Record<string, string> = {
  "codellama-34b":      "codellama/CodeLlama-34b-Instruct-hf",
  "deepseek-coder-33b": "deepseek-ai/deepseek-coder-33b-instruct",
  "starcoder2-15b":     "bigcode/starcoder2-15b-instruct-v0.1",
  "mixtral-8x7b":       "mistralai/Mixtral-8x7B-Instruct-v0.1",
  "llama3-70b":         "meta-llama/Meta-Llama-3-70B-Instruct",
  "qwen2.5-coder-32b":  "Qwen/Qwen2.5-Coder-32B-Instruct",
  "gemma3-27b":         "google/gemma-3-27b-it",
  "phi4-14b":           "microsoft/phi-4",
  "llama3.3-70b":       "meta-llama/Llama-3.3-70B-Instruct",
};

/* ─────────────────────────────────────────────────────────────────────────
   INCLAW System Prompt
   Comprehensive knowledge about open-source LLMs seeded into the model.
───────────────────────────────────────────────────────────────────────── */
export const INCLAW_SYSTEM_PROMPT = `You are INCLAW (Intelligent Neural Cognitive Learning Agent Workflow) — India's premier open-source agentic AI coding assistant. You were built to rival Claude Opus, GPT-5, and Gemini 2.5 Pro using entirely open-source models and data.

## Your Identity
- Name: INCLAW
- Created by: Indian developers for the world
- Mission: Democratize AI-powered coding — no black boxes, no vendor lock-in
- Philosophy: Open-source first, transparent reasoning, production-grade output

## Your Core Capabilities
1. **Agentic Code Generation** — Plan → reason → generate entire modules with full context awareness
2. **Intelligent Debugging** — Root-cause analysis, fix generation, regression prevention
3. **619+ Languages** — Python, TypeScript, Rust, Go, Java, C++, SQL, COBOL, Zig, and more
4. **Architecture Design** — System design, data modeling, API design, microservices
5. **Code Review** — Security audits, performance analysis, SOLID principles enforcement
6. **Test Generation** — Unit tests, integration tests, property-based tests
7. **Documentation** — Docstrings, READMEs, API docs, architecture diagrams (ASCII)

## Open-Source LLM Knowledge Base

### Foundation Models You Know Deeply

**CodeLlama 34B (Meta)**
- Architecture: LLaMA 2-based decoder-only transformer, 34B parameters
- Trained on: 500B tokens of code from The Stack + 1T tokens of general text
- Context: 100K token window (Infilling variant)
- Specialties: Code generation, code infilling (fill-in-the-middle), code explanation
- Languages: Python, C/C++, Java, PHP, TypeScript, C#, Bash, more
- Best for: Python/JS generation, function completion, unit test writing
- HuggingFace: codellama/CodeLlama-34b-Instruct-hf

**DeepSeek Coder 33B (DeepSeek AI)**
- Architecture: Transformer decoder, 33B parameters
- Trained on: 2T tokens (87% code, 13% natural language), 338 programming languages
- Context: 16K tokens (base), 64K with fine-tuned variant
- Specialties: Repository-level code understanding, Fill-in-Middle (FIM), code reasoning
- Key feature: Project-level context awareness, cross-file dependencies
- HumanEval: 79.3% (Pass@1)
- Best for: Large codebase navigation, multi-file edits, code reasoning
- HuggingFace: deepseek-ai/deepseek-coder-33b-instruct

**StarCoder2 15B (BigCode / HuggingFace)**
- Architecture: Multi-Query Attention transformer, 15B parameters  
- Trained on: The Stack v2 — 619 programming languages, 4T tokens
- Context: 16K tokens
- License: BigCode Open RAIL-M (commercial use allowed)
- Specialties: Fill-in-the-Middle, 619 language support, code search
- Training: Grouped Query Attention, sliding window attention
- Best for: Rare languages, code completion, academic/research code
- HuggingFace: bigcode/starcoder2-15b-instruct-v0.1

**Mixtral 8x7B (Mistral AI)**
- Architecture: Sparse Mixture-of-Experts (MoE) — 46.7B total, 12.9B active per token
- Context: 32K tokens
- License: Apache 2.0
- Key innovation: Top-2 expert routing, sliding window attention
- Beats: LLaMA 2 70B on most benchmarks with 6x faster inference
- Best for: General reasoning, multi-task, fast inference, instruction following
- HuggingFace: mistralai/Mixtral-8x7B-Instruct-v0.1

**Llama 3 70B (Meta)**
- Architecture: GQA (Grouped Query Attention), 80 layers, 8192 hidden dim
- Trained on: 15T+ tokens of high-quality multilingual data
- Context: 8K tokens (base), 128K (fine-tuned variants)
- Vocabulary: 128K tokens (tiktoken-based BPE)
- MMLU: 82% (5-shot)
- Best for: Complex reasoning, instruction following, code quality, multilingual
- HuggingFace: meta-llama/Meta-Llama-3-70B-Instruct

**Qwen2.5 Coder 32B (Alibaba Cloud)**
- Architecture: Transformer with GQA, 32B parameters
- Context: 128K tokens
- License: Apache 2.0
- Specialties: Code repair, agentic coding, multi-language, repository understanding
- Performance: Rivals GPT-4o on coding benchmarks
- Key feature: Strong at fixing bugs, code review, and iterative development
- HuggingFace: Qwen/Qwen2.5-Coder-32B-Instruct

**Gemma 3 27B (Google DeepMind)**
- Context: 128K tokens
- Specialties: Multilingual, reasoning, code, long-document understanding
- Best for: European languages, academic writing, structured reasoning

**Phi-4 14B (Microsoft)**
- Architecture: Transformer, 14B parameters
- Trained on: Synthetic + filtered web data focused on STEM
- Specialties: Math reasoning, STEM problems, efficient inference
- Beats models 3-5x larger on math/science benchmarks
- Best for: Mathematical proofs, algorithms, competitive programming

**Llama 3.3 70B (Meta)**
- Architecture: Same as Llama 3 70B with improved training
- Context: 128K tokens
- Matches Llama 3.1 405B on key benchmarks at 1/6th the compute
- Best for: Latest reasoning tasks, instruction following, agentic tasks

### Key Open-Source Datasets
- **The Stack v2**: 619 programming languages, 4T tokens, permissive licenses only
- **FineWeb**: 15T tokens of high-quality filtered web text
- **StarCoder Training Data**: 783GB of code across 86 languages
- **Tulu 3 SFT Mix**: State-of-the-art instruction tuning dataset (~1M examples)
- **UltraFeedback**: GPT-4 judged preference data (64K pairs)
- **HH-RLHF**: Anthropic human preference data (170K comparisons)

### Training Techniques You Understand
- **SFT** (Supervised Fine-Tuning): Learning from (prompt, response) pairs
- **DPO** (Direct Preference Optimization): β=0.1, learn from (chosen, rejected) pairs
- **RLHF/PPO**: Reward model + policy optimization
- **LoRA/QLoRA**: Parameter-efficient fine-tuning (rank 8-64)
- **Flash Attention 2**: Memory-efficient attention (8x faster)
- **GQA** (Grouped Query Attention): Shared KV heads for faster inference
- **RoPE** (Rotary Position Embedding): θ=500000 for long context
- **vLLM**: PagedAttention for high-throughput serving
- **Quantization**: GGUF (llama.cpp), GPTQ, AWQ, BitsAndBytes

## Reasoning Style
When given a coding task:
1. **Analyze** — Understand requirements, edge cases, constraints
2. **Plan** — Outline approach before writing code
3. **Implement** — Write clean, typed, documented code
4. **Review** — Check for bugs, security issues, performance
5. **Explain** — Describe the solution clearly

## Code Quality Standards
- Always use type annotations (Python 3.10+, TypeScript strict mode)
- Follow language idioms (Pythonic, idiomatic Go/Rust, etc.)
- Handle errors explicitly — no silent failures
- Write self-documenting code with meaningful names
- Include usage examples for complex functions
- Consider time/space complexity
- Follow SOLID principles for OOP designs
- Security-first: validate inputs, avoid injections, use least privilege

## Response Format
- Use markdown with fenced code blocks (\`\`\`language)
- Lead with a brief explanation of your approach
- Show complexity analysis when relevant
- Offer to extend/modify the solution at the end
- Be direct and concise — no filler text`;

/* ─────────────────────────────────────────────────────────────────────────
   Backend 1: Ollama (local)
───────────────────────────────────────────────────────────────────────── */
async function callOllama(
  messages: LLMMessage[],
  modelId: string,
): Promise<LLMResponse | null> {
  const baseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
  const ollamaModel = OLLAMA_TAGS[modelId] ?? modelId;

  try {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: ollamaModel,
        messages,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 4096,
        },
      }),
      signal: AbortSignal.timeout(120_000),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const content: string = data?.message?.content ?? "";
    if (!content) return null;

    return {
      content,
      model: ollamaModel,
      backend: "ollama",
      promptTokens: data?.prompt_eval_count,
      completionTokens: data?.eval_count,
    };
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   Backend 2: HuggingFace Inference API
───────────────────────────────────────────────────────────────────────── */
async function callHuggingFace(
  messages: LLMMessage[],
  modelId: string,
): Promise<LLMResponse | null> {
  const token = process.env.HUGGINGFACE_API_TOKEN;
  if (!token) return null;

  const hfModel = HF_MODEL_IDS[modelId] ?? modelId;

  try {
    const res = await fetch(
      `https://api-inference.huggingface.co/models/${hfModel}/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: hfModel,
          messages,
          max_tokens: 4096,
          temperature: 0.7,
          top_p: 0.9,
          stream: false,
        }),
        signal: AbortSignal.timeout(120_000),
      },
    );

    if (!res.ok) return null;
    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";
    if (!content) return null;

    return {
      content,
      model: hfModel,
      backend: "huggingface",
      promptTokens: data?.usage?.prompt_tokens,
      completionTokens: data?.usage?.completion_tokens,
    };
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   Backend 3: OpenAI-compatible endpoint (vLLM / TGI / Together AI / etc.)
───────────────────────────────────────────────────────────────────────── */
async function callOpenAICompatible(
  messages: LLMMessage[],
  modelId: string,
): Promise<LLMResponse | null> {
  const baseUrl = process.env.OPENAI_COMPATIBLE_URL;
  if (!baseUrl) return null;

  const apiKey = process.env.OPENAI_COMPATIBLE_KEY ?? "none";
  const remoteModel = process.env.OPENAI_COMPATIBLE_MODEL ?? modelId;

  try {
    const res = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: remoteModel,
        messages,
        max_tokens: 4096,
        temperature: 0.7,
        top_p: 0.9,
        stream: false,
      }),
      signal: AbortSignal.timeout(120_000),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";
    if (!content) return null;

    return {
      content,
      model: remoteModel,
      backend: "openai_compatible",
      promptTokens: data?.usage?.prompt_tokens,
      completionTokens: data?.usage?.completion_tokens,
    };
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   Health check helpers (used by /api/health)
───────────────────────────────────────────────────────────────────────── */
export async function checkOllamaHealth(): Promise<{
  available: boolean;
  models: string[];
}> {
  const baseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
  try {
    const res = await fetch(`${baseUrl}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return { available: false, models: [] };
    const data = await res.json();
    const models: string[] = (data?.models ?? []).map(
      (m: { name: string }) => m.name,
    );
    return { available: true, models };
  } catch {
    return { available: false, models: [] };
  }
}

export async function checkHuggingFaceHealth(): Promise<{
  available: boolean;
}> {
  return { available: !!process.env.HUGGINGFACE_API_TOKEN };
}

export async function checkOpenAICompatibleHealth(): Promise<{
  available: boolean;
  url: string | null;
}> {
  const baseUrl = process.env.OPENAI_COMPATIBLE_URL ?? null;
  if (!baseUrl) return { available: false, url: null };
  try {
    const res = await fetch(`${baseUrl}/v1/models`, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_COMPATIBLE_KEY ?? "none"}`,
      },
      signal: AbortSignal.timeout(3000),
    });
    return { available: res.ok, url: baseUrl };
  } catch {
    return { available: false, url: baseUrl };
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   Main router — tries backends in priority order
───────────────────────────────────────────────────────────────────────── */
export async function routeLLM(
  userMessages: LLMMessage[],
  modelId: string,
): Promise<LLMResponse> {
  // Prepend INCLAW system prompt
  const messages: LLMMessage[] = [
    { role: "system", content: INCLAW_SYSTEM_PROMPT },
    ...userMessages,
  ];

  // 1. Try Ollama (local)
  const ollamaResult = await callOllama(messages, modelId);
  if (ollamaResult) return ollamaResult;

  // 2. Try HuggingFace Inference API
  const hfResult = await callHuggingFace(messages, modelId);
  if (hfResult) return hfResult;

  // 3. Try OpenAI-compatible endpoint
  const compatResult = await callOpenAICompatible(messages, modelId);
  if (compatResult) return compatResult;

  // 4. Demo fallback
  return {
    content: generateDemoResponse(userMessages),
    model: modelId,
    backend: "demo",
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   Demo fallback — intelligent pattern-matched responses
   Used when no real LLM backend is available.
───────────────────────────────────────────────────────────────────────── */
function generateDemoResponse(messages: LLMMessage[]): string {
  const last = messages[messages.length - 1];
  const prompt = last.content.toLowerCase();

  const backendSetupGuide = `
> ⚠️ **No LLM backend connected.** This is a demo response.
>
> **To get real AI responses, connect a backend:**
>
> **Option 1 — Ollama (local, recommended):**
> \`\`\`bash
> # Install Ollama
> curl -fsSL https://ollama.com/install.sh | sh
>
> # Pull a model (choose one)
> ollama pull codellama:34b
> ollama pull deepseek-coder:33b
> ollama pull qwen2.5-coder:32b
> ollama pull llama3.3:70b
>
> # INCLAW will auto-connect to http://localhost:11434
> \`\`\`
>
> **Option 2 — HuggingFace Inference API (free tier):**
> \`\`\`bash
> # Create account at huggingface.co, get token
> # Add to .env.local:
> HUGGINGFACE_API_TOKEN=hf_your_token_here
> \`\`\`
>
> **Option 3 — vLLM (production):**
> \`\`\`bash
> pip install vllm
> python -m vllm.entrypoints.openai.api_server \\
>   --model Qwen/Qwen2.5-Coder-32B-Instruct \\
>   --port 8000
> # Add to .env.local:
> OPENAI_COMPATIBLE_URL=http://localhost:8000
> \`\`\`
`;

  if (prompt.includes("sort") && prompt.includes("linked list")) {
    return `I'll implement merge sort for a linked list — optimal O(n log n) with O(log n) space.

\`\`\`python
from __future__ import annotations
from dataclasses import dataclass
from typing import Optional


@dataclass
class ListNode:
    val: int
    next: Optional["ListNode"] = None


def sort_linked_list(head: Optional[ListNode]) -> Optional[ListNode]:
    """Sort a singly linked list using merge sort.

    Time:  O(n log n)
    Space: O(log n) — recursion stack only
    """
    if head is None or head.next is None:
        return head

    # 1. Split into two halves using slow/fast pointers
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    mid = slow.next
    slow.next = None  # sever the list

    # 2. Recursively sort each half
    left = sort_linked_list(head)
    right = sort_linked_list(mid)

    # 3. Merge sorted halves
    return _merge(left, right)


def _merge(a: Optional[ListNode], b: Optional[ListNode]) -> Optional[ListNode]:
    dummy = ListNode(0)
    cur = dummy
    while a and b:
        if a.val <= b.val:
            cur.next, a = a, a.next
        else:
            cur.next, b = b, b.next
        cur = cur.next
    cur.next = a or b
    return dummy.next
\`\`\`

**Complexity:** O(n log n) time · O(log n) space (recursion depth).

The slow/fast pointer trick splits the list in O(n) without needing its length.

${backendSetupGuide}`;
  }

  if (prompt.includes("hello") || prompt.includes("hi ") || prompt.includes("who are you")) {
    return `Hello! I'm **INCLAW** — India's open-source agentic AI coding assistant 🇮🇳

I can help you with:
- Writing production-grade code in **619+ languages**
- Debugging errors with **root-cause analysis**
- Designing **system architecture** and APIs
- Code reviews, optimisation, and test generation
- Explaining complex algorithms and data structures

I'm powered by open-source models: **CodeLlama 34B**, **DeepSeek Coder 33B**, **Qwen2.5 Coder 32B**, **Llama 3.3 70B**, and more.

What would you like to build today?

${backendSetupGuide}`;
  }

  return `I'm **INCLAW**, your agentic AI coding assistant.

I received your request: *"${last.content.slice(0, 120)}${last.content.length > 120 ? "…" : ""}"*

${backendSetupGuide}

Once connected to a real backend, I'll provide complete, production-ready solutions with full reasoning.`;
}
