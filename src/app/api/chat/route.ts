import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_MESSAGE } from "@/lib/inclawBrain";
import { findRelevantKnowledge } from "@/lib/inclawKnowledge";
import { getHistory, saveMessage } from "@/lib/userMemory";
import { SUPPORTED_MODELS } from "@/lib/constants";

interface ChatRequestBody {
  message: string;
  userId?: string;
  sessionId?: string;
  model?: string;
  autoRoute?: boolean;
}

interface OllamaTagStatus {
  available: boolean;
  modelReady: boolean;
}

interface ModelSelection {
  id: string;
  name: string;
  ollamaTag: string;
}

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

function resolveModel(message: string, model?: string, autoRoute = true): ModelSelection {
  const requested = SUPPORTED_MODELS.find(
    (m) => m.id === model || m.ollamaTag === model || m.name.toLowerCase() === model?.toLowerCase()
  );

  if (!autoRoute && requested) {
    return { id: requested.id, name: requested.name, ollamaTag: requested.ollamaTag };
  }

  const prompt = message.toLowerCase();
  if (prompt.match(/debug|error|stack|trace/)) {
    const m = SUPPORTED_MODELS.find((item) => item.id === "deepseek-coder-33b")!;
    return { id: m.id, name: m.name, ollamaTag: m.ollamaTag };
  }
  if (prompt.match(/system design|architecture|scale|distributed/)) {
    const m = SUPPORTED_MODELS.find((item) => item.id === "mixtral-8x7b")!;
    return { id: m.id, name: m.name, ollamaTag: m.ollamaTag };
  }
  if (prompt.match(/math|equation|calculate|proof/)) {
    const m = SUPPORTED_MODELS.find((item) => item.id === "phi4-14b")!;
    return { id: m.id, name: m.name, ollamaTag: m.ollamaTag };
  }
  if (prompt.match(/unit test|test case|testing/)) {
    const m = SUPPORTED_MODELS.find((item) => item.id === "codellama-34b")!;
    return { id: m.id, name: m.name, ollamaTag: m.ollamaTag };
  }

  const fallback = requested || SUPPORTED_MODELS.find((m) => m.id === "qwen2.5-coder-32b")!;
  return { id: fallback.id, name: fallback.name, ollamaTag: fallback.ollamaTag };
}

async function checkOllamaStatus(tag: string): Promise<OllamaTagStatus> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const response = await fetch(`${OLLAMA_URL}/api/tags`, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) return { available: false, modelReady: false };
    const data = await response.json();
    const hasModel = Array.isArray(data?.models)
      ? data.models.some((m: { name?: string }) => m.name === tag)
      : false;

    return { available: true, modelReady: hasModel };
  } catch {
    return { available: false, modelReady: false };
  }
}

function knowledgeMessages(userQuery: string) {
  const matches = findRelevantKnowledge(userQuery);
  return matches.map((entry) => ({
    role: "system" as const,
    content: `Context: ${entry.topic}\n${entry.content}`,
  }));
}

function buildOllamaPayload(messages: { role: string; content: string }[], model: string) {
  return {
    model,
    messages,
    stream: true,
  };
}

function encodeChunk(payload: unknown) {
  return new TextEncoder().encode(`${JSON.stringify(payload)}\n`);
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const { message, model, autoRoute = true } = body;
    const userId = body.userId || request.headers.get("x-inclaw-user-id") || "anonymous";
    const sessionId = body.sessionId || request.headers.get("x-inclaw-session-id") || crypto.randomUUID();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const selectedModel = resolveModel(message, model, autoRoute);
    const { available, modelReady } = await checkOllamaStatus(selectedModel.ollamaTag);

    const history = await getHistory(userId, sessionId, 10);
    const contextMessages = [
      SYSTEM_MESSAGE,
      ...knowledgeMessages(message),
      ...history.map((h) => ({ role: h.role, content: h.content })),
      { role: "user" as const, content: message },
    ];

    const fullMessages = buildOllamaPayload(contextMessages, selectedModel.ollamaTag);
    const promptMessage = { userId, sessionId, role: "user" as const, content: message };

    const stream = new ReadableStream({
      async start(controller) {
        if (!available || !modelReady) {
          const fallback =
            "INCLAW is currently loading this model. Please try the General model or check back shortly.";
          controller.enqueue(
            encodeChunk({
              type: "done",
              data: {
                response: fallback,
                modelUsed: selectedModel.name,
                modelId: selectedModel.ollamaTag,
                sessionId,
              },
            })
          );
          controller.close();
          await saveMessage({ ...promptMessage, modelUsed: selectedModel.name });
          await saveMessage({
            userId,
            sessionId,
            role: "assistant",
            content: fallback,
            modelUsed: selectedModel.name,
          });
          return;
        }

        let accumulated = "";
        try {
          const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fullMessages),
          });

          if (!ollamaRes.body) {
            throw new Error("Ollama response missing body");
          }

          const reader = ollamaRes.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const parsed = JSON.parse(line);
                const token = parsed?.message?.content || parsed?.response || "";
                if (token) {
                  accumulated += token;
                  controller.enqueue(encodeChunk({ type: "token", data: token }));
                }
              } catch {
                // ignore malformed lines
              }
            }
          }

          if (buffer.trim()) {
            try {
              const parsed = JSON.parse(buffer);
              const token = parsed?.message?.content || parsed?.response || "";
              if (token) {
                accumulated += token;
                controller.enqueue(encodeChunk({ type: "token", data: token }));
              }
            } catch {
              // ignore trailing parse error
            }
          }
        } catch {
          const fallback =
            "INCLAW is currently loading this model. Please try the General model or check back shortly.";
          accumulated = fallback;
          controller.enqueue(encodeChunk({ type: "token", data: fallback }));
        } finally {
          controller.enqueue(
            encodeChunk({
              type: "done",
              data: {
                response: accumulated,
                modelUsed: selectedModel.name,
                modelId: selectedModel.ollamaTag,
                sessionId,
              },
            })
          );
          controller.close();

          await saveMessage({ ...promptMessage, modelUsed: selectedModel.name });
          await saveMessage({
            userId,
            sessionId,
            role: "assistant",
            content: accumulated,
            modelUsed: selectedModel.name,
          });
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache, no-transform",
        "X-Model-Used": selectedModel.name,
        "X-Model-Tag": selectedModel.ollamaTag,
        "X-Session-Id": sessionId,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
