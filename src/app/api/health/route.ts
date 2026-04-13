import { NextResponse } from "next/server";
import {
  checkOllamaHealth,
  checkHuggingFaceHealth,
  checkOpenAICompatibleHealth,
} from "@/lib/llm";

/**
 * GET /api/health
 *
 * Returns the health status of all configured LLM backends.
 * Use this to confirm which backends are reachable before chatting.
 */
export async function GET() {
  const [ollama, huggingface, openaiCompatible] = await Promise.all([
    checkOllamaHealth(),
    checkHuggingFaceHealth(),
    checkOpenAICompatibleHealth(),
  ]);

  const anyAvailable =
    ollama.available || huggingface.available || openaiCompatible.available;

  return NextResponse.json({
    status: anyAvailable ? "ready" : "demo_mode",
    backends: {
      ollama: {
        available: ollama.available,
        url: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
        models: ollama.models,
      },
      huggingface: {
        available: huggingface.available,
        note: huggingface.available
          ? "API token configured"
          : "Set HUGGINGFACE_API_TOKEN to enable",
      },
      openai_compatible: {
        available: openaiCompatible.available,
        url: openaiCompatible.url,
        note: openaiCompatible.url
          ? openaiCompatible.available
            ? "Endpoint reachable"
            : "Endpoint unreachable"
          : "Set OPENAI_COMPATIBLE_URL to enable",
      },
    },
    setup_guide: anyAvailable
      ? null
      : {
          ollama: "curl -fsSL https://ollama.com/install.sh | sh && ollama pull qwen2.5-coder:32b",
          huggingface: "Set HUGGINGFACE_API_TOKEN=hf_... in .env.local",
          vllm: "python -m vllm.entrypoints.openai.api_server --model Qwen/Qwen2.5-Coder-32B-Instruct",
        },
  });
}
