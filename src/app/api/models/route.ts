import { NextResponse } from "next/server";

/**
 * GET /api/models
 * Returns the list of supported open-source models used by INCLAW.
 */
export async function GET() {
  const models = [
    {
      id: "codellama-34b",
      name: "CodeLlama 34B",
      provider: "Meta",
      parameters: "34B",
      status: "available",
      capabilities: ["code-generation", "code-completion", "debugging"],
    },
    {
      id: "deepseek-coder-33b",
      name: "DeepSeek Coder 33B",
      provider: "DeepSeek AI",
      parameters: "33B",
      status: "available",
      capabilities: ["multi-language", "code-reasoning", "fill-in-middle"],
    },
    {
      id: "starcoder2-15b",
      name: "StarCoder2 15B",
      provider: "BigCode / Hugging Face",
      parameters: "15B",
      status: "available",
      capabilities: ["619-languages", "fill-in-middle", "long-context"],
    },
    {
      id: "mixtral-8x7b",
      name: "Mixtral 8x7B",
      provider: "Mistral AI",
      parameters: "46.7B (12.9B active)",
      status: "available",
      capabilities: ["reasoning", "multi-task", "fast-inference"],
    },
    {
      id: "llama3-70b",
      name: "Llama 3 70B",
      provider: "Meta",
      parameters: "70B",
      status: "available",
      capabilities: ["advanced-reasoning", "code-quality", "instruction-following"],
    },
    {
      id: "qwen2.5-coder-32b",
      name: "Qwen2.5 Coder 32B",
      provider: "Alibaba Cloud",
      parameters: "32B",
      status: "available",
      capabilities: ["code-repair", "multi-language", "agentic-coding"],
    },
  ];

  return NextResponse.json({
    models,
    total: models.length,
    note: "All models are open-source. Connect to Ollama, HuggingFace, or vLLM for live inference.",
  });
}
