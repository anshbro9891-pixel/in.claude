declare global {
  interface Window {
    puter?: PuterSDK;
  }
}

const PUTER_CDN = "https://js.puter.com/v2/";

interface PuterChatChunk {
  message?: { content?: string };
  response?: string;
}

interface PuterChatOptionsInternal {
  model?: string;
  stream?: boolean;
}

interface PuterSDK {
  ai?: {
    chat: (messages: PuterMessage[], options?: PuterChatOptionsInternal) => Promise<AsyncIterable<PuterChatChunk>>;
  };
}

export type PuterMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export interface PuterChatOptions {
  model?: string;
  onToken?: (token: string, full: string) => void;
}

/**
 * Ensures the Puter.js SDK is loaded on the client.
 * Returns the global puter object or null (SSR / failed load).
 */
export async function loadPuter(): Promise<PuterSDK | null> {
  if (typeof window === "undefined") return null;
  if (window.puter?.ai) return window.puter;

  await new Promise<void>((resolve, reject) => {
    // Avoid injecting multiple scripts
    const existing = document.querySelector(`script[src="${PUTER_CDN}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Puter.js SDK")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = PUTER_CDN;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Puter.js SDK"));
    document.body.appendChild(script);
  });

  return window.puter?.ai ? window.puter : null;
}

/**
 * Streams a chat completion from Puter AI.
 * Throws if Puter is not ready.
 */
export async function streamPuterChat(
  messages: PuterMessage[],
  options?: PuterChatOptions
): Promise<string> {
  const client = await loadPuter();
  if (!client?.ai?.chat) {
    throw new Error("Puter AI is not available in this environment.");
  }

  const stream = await client.ai.chat(messages, {
    model: options?.model,
    stream: true,
  });

  let fullText = "";
  for await (const chunk of stream as AsyncIterable<PuterChatChunk>) {
    const token = chunk?.message?.content || chunk?.response || "";
    if (token) {
      fullText += token;
      options?.onToken?.(token, fullText);
    }
  }

  return fullText;
}
