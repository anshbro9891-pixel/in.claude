import { useCallback, useEffect, useRef, useState } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  modelUsed?: string | null;
  pending?: boolean;
}

export type ModelStatus = "online" | "offline" | "loading";

const USER_ID_STORAGE_KEY = "inclaw:user-id";
const FALLBACK_MESSAGE =
  "INCLAW is warming up, try again in a moment";

const createId = () => crypto.randomUUID();

export function useInclawChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState<string | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatus>("online");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const userIdRef = useRef<string | null>(null);

  const ensureUserId = useCallback(() => {
    if (userIdRef.current) return userIdRef.current;
    if (typeof window === "undefined") {
      userIdRef.current = "anonymous";
      return userIdRef.current;
    }
    const existing = localStorage.getItem(USER_ID_STORAGE_KEY);
    if (existing) {
      userIdRef.current = existing;
      return existing;
    }
    const fresh = createId();
    localStorage.setItem(USER_ID_STORAGE_KEY, fresh);
    userIdRef.current = fresh;
    return fresh;
  }, []);

  useEffect(() => { ensureUserId(); }, [ensureUserId]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
  }, []);

  const updateAssistant = useCallback((id: string, updater: (content: string) => string, model?: string | null) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id
          ? { ...msg, content: updater(msg.content), pending: false, modelUsed: model ?? msg.modelUsed }
          : msg
      )
    );
  }, []);

  const sendMessage = useCallback(
    async (content: string, options?: { model?: string; autoRoute?: boolean }) => {
      if (!content.trim()) return;

      const userId = ensureUserId();
      const activeSession = sessionId ?? createId();
      setSessionId(activeSession);
      setIsLoading(true);
      setModelStatus("loading");

      const userMessage: ChatMessage = { id: createId(), role: "user", content };
      const assistantId = createId();
      setMessages((prev) => [...prev, userMessage, { id: assistantId, role: "assistant", content: "", pending: true }]);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-inclaw-user-id": userId,
            "x-inclaw-session-id": activeSession,
          },
          body: JSON.stringify({
            message: content,
            userId,
            sessionId: activeSession,
            model: options?.model,
            autoRoute: options?.autoRoute ?? true,
          }),
        });

        if (!response.body) {
          throw new Error("Chat request failed");
        }

        if (!response.ok) {
          const errorText = await response
            .json()
            .then((res) => res?.error as string | undefined)
            .catch(() => undefined);
          updateAssistant(assistantId, () => errorText || FALLBACK_MESSAGE, currentModel);
          setModelStatus("offline");
          setIsLoading(false);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let detectedModel = response.headers.get("x-model-used");
        let resolvedSession = response.headers.get("x-session-id") || activeSession;
        let finalResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const payload = JSON.parse(line);
              if (payload.type === "token" && typeof payload.data === "string") {
                finalResponse += payload.data;
                updateAssistant(assistantId, (prev) => prev + payload.data, detectedModel);
              }
              if (payload.type === "done") {
                const data = payload.data ?? {};
                detectedModel = data.modelId || data.modelUsed || detectedModel;
                resolvedSession = data.sessionId || resolvedSession;
                setSessionId(resolvedSession);
                if (typeof data.response === "string") {
                  finalResponse = data.response;
                  updateAssistant(assistantId, () => data.response, detectedModel);
                }
              }
            } catch {
              // ignore malformed chunks
            }
          }
        }

        if (buffer.trim()) {
          try {
            const payload = JSON.parse(buffer);
            if (payload.type === "done" && typeof payload.data?.response === "string") {
              detectedModel = payload.data.modelId || payload.data.modelUsed || detectedModel;
              setSessionId(payload.data.sessionId || resolvedSession);
              finalResponse = payload.data.response;
              updateAssistant(assistantId, () => payload.data.response, detectedModel);
            }
          } catch {
            // ignore trailing garbage
          }
        }

        if (detectedModel) {
          setCurrentModel(detectedModel);
          const offline = finalResponse.includes("loading this model") || finalResponse === FALLBACK_MESSAGE;
          setModelStatus(offline ? "offline" : "online");
        } else {
          setModelStatus("online");
        }
      } catch {
        updateAssistant(assistantId, () => FALLBACK_MESSAGE, currentModel);
        setModelStatus("offline");
      } finally {
        setIsLoading(false);
      }
    },
    [ensureUserId, sessionId, updateAssistant, currentModel]
  );

  return {
    messages,
    sendMessage,
    isLoading,
    currentModel,
    modelStatus,
    clearChat,
    sessionId,
  };
}
