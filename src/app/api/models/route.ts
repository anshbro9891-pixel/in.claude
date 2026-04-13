import { NextResponse } from "next/server";
import { SUPPORTED_MODELS } from "@/lib/constants";

/**
 * GET /api/models
 * Returns the full list of open-source models supported by INCLAW,
 * along with their Ollama tags and HuggingFace IDs for easy setup.
 */

const MODEL_DETAILS: Record<
  string,
  { ollamaTag: string; hfId: string; context: string }
> = {
  "codellama-34b": {
    ollamaTag: "codellama:34b",
    hfId: "codellama/CodeLlama-34b-Instruct-hf",
    context: "100K",
  },
  "deepseek-coder-33b": {
    ollamaTag: "deepseek-coder:33b",
    hfId: "deepseek-ai/deepseek-coder-33b-instruct",
    context: "16K",
  },
  "starcoder2-15b": {
    ollamaTag: "starcoder2:15b",
    hfId: "bigcode/starcoder2-15b-instruct-v0.1",
    context: "16K",
  },
  "mixtral-8x7b": {
    ollamaTag: "mixtral:8x7b",
    hfId: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    context: "32K",
  },
  "llama3-70b": {
    ollamaTag: "llama3:70b",
    hfId: "meta-llama/Meta-Llama-3-70B-Instruct",
    context: "8K",
  },
  "qwen2.5-coder-32b": {
    ollamaTag: "qwen2.5-coder:32b",
    hfId: "Qwen/Qwen2.5-Coder-32B-Instruct",
    context: "128K",
  },
  "gemma3-27b": {
    ollamaTag: "gemma3:27b",
    hfId: "google/gemma-3-27b-it",
    context: "128K",
  },
  "phi4-14b": {
    ollamaTag: "phi4:14b",
    hfId: "microsoft/phi-4",
    context: "16K",
  },
  "llama3.3-70b": {
    ollamaTag: "llama3.3:70b",
    hfId: "meta-llama/Llama-3.3-70B-Instruct",
    context: "128K",
  },
};

export async function GET() {
  const models = SUPPORTED_MODELS.map((m) => {
    const details = MODEL_DETAILS[m.id] ?? {
      ollamaTag: m.id,
      hfId: m.id,
      context: "16K",
    };
    return {
      id: m.id,
      name: m.name,
      provider: m.provider,
      parameters: m.parameters,
      license: m.license,
      strengths: [...m.strengths],
      context_window: details.context,
      backends: {
        ollama: {
          pull_command: `ollama pull ${details.ollamaTag}`,
          tag: details.ollamaTag,
        },
        huggingface: {
          model_id: details.hfId,
          url: `https://huggingface.co/${details.hfId}`,
        },
      },
    };
  });

  return NextResponse.json({
    models,
    total: models.length,
    quick_start: {
      recommended: "qwen2.5-coder:32b",
      command: "ollama pull qwen2.5-coder:32b",
      note: "Qwen2.5 Coder 32B offers the best balance of quality, speed, and 128K context",
    },
  });
}
