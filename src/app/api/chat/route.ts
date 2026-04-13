import { NextRequest, NextResponse } from "next/server";
import { routeLLM, type LLMMessage } from "@/lib/llm";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  model: string;
}

/**
 * INCLAW Chat API
 *
 * Routes to real open-source LLM inference backends in priority order:
 *   1. Ollama (local)               — OLLAMA_BASE_URL
 *   2. HuggingFace Inference API    — HUGGINGFACE_API_TOKEN
 *   3. OpenAI-compatible endpoint   — OPENAI_COMPATIBLE_URL + OPENAI_COMPATIBLE_KEY
 *   4. Demo fallback                — pattern-matched responses
 *
 * All requests include the full INCLAW system prompt with seeded
 * open-source LLM knowledge so the model behaves as a knowledgeable
 * agentic coding assistant regardless of which backend is used.
 *
 * See .env.example for configuration.
 */

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, model } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 },
      );
    }

    // Convert chat messages to LLMMessage format (system prompt added by routeLLM)
    const llmMessages: LLMMessage[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const result = await routeLLM(llmMessages, model);

    return NextResponse.json({
      content: result.content,
      model: result.model,
      backend: result.backend,
      usage: {
        prompt_tokens: result.promptTokens,
        completion_tokens: result.completionTokens,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
