"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bot,
  CheckCircle2,
  ImageIcon,
  Loader2,
  Mic2,
  Search,
  Sparkles,
  Video,
  Wand2,
} from "lucide-react";
import InclawLogo from "@/components/InclawLogo";
import { PuterMessage, loadPuter, streamPuterChat } from "@/lib/puterClient";

type TaskId = "image" | "video" | "chat" | "search" | "audio" | "models";

const DEFAULT_IMAGE = "https://assets.puter.site/doge.jpeg";
const DEFAULT_VIDEO = "https://interactive-examples.mdn.mozilla.net/media/examples/flower.webm";
const DEFAULT_AUDIO =
  "https://upload.wikimedia.org/wikipedia/commons/4/45/Beep-09.ogg";

const TASK_MODEL_MAP: Record<TaskId, string> = {
  image: "llava-phi-3-vision",
  video: "llama-3.3-70b",
  chat: "llama-3.3-70b",
  search: "deepseek-r1",
  audio: "whisper-large-v3",
  models: "qwen2.5-coder",
};

const MODEL_OPTIONS = [
  { id: "auto", label: "Auto-route (task aware)" },
  { id: "llama-3.3-70b", label: "Llama 3.3 70B (reasoning)" },
  { id: "deepseek-r1", label: "DeepSeek R1 (search/brainstorm)" },
  { id: "deepseek-coder", label: "DeepSeek Coder (code + tools)" },
  { id: "llava-phi-3-vision", label: "LLaVA Phi-3 (vision)" },
  { id: "mixtral-8x7b", label: "Mixtral 8x7B (balanced)" },
  { id: "whisper-large-v3", label: "Whisper v3 (audio)" },
];

interface TaskState {
  status: "idle" | "running" | "done" | "error";
  output: string;
  error?: string;
}

const initialTaskState: TaskState = { status: "idle", output: "" };

export default function PuterCapabilityLab() {
  const [puterReady, setPuterReady] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("auto");
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE);
  const [videoUrl, setVideoUrl] = useState(DEFAULT_VIDEO);
  const [chatPrompt, setChatPrompt] = useState("Explain how INCLAW routes across open-source cloud models.");
  const [searchQuery, setSearchQuery] = useState("Latest open-source LLM releases for coding");
  const [audioUrl, setAudioUrl] = useState(DEFAULT_AUDIO);
  const [allModelPrompt, setAllModelPrompt] = useState("Test all connected models and report which are live.");
  const [tasks, setTasks] = useState<Record<TaskId, TaskState>>({
    image: initialTaskState,
    video: initialTaskState,
    chat: initialTaskState,
    search: initialTaskState,
    audio: initialTaskState,
    models: initialTaskState,
  });

  useEffect(() => {
    let mounted = true;
    loadPuter()
      .then((client) => {
        if (!mounted) return;
        setPuterReady(Boolean(client?.ai));
      })
      .catch(() => {
        if (mounted) setPuterReady(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const taskModel = useCallback(
    (task: TaskId) => {
      if (selectedModel === "auto") return TASK_MODEL_MAP[task] || "llama-3.3-70b";
      return selectedModel;
    },
    [selectedModel]
  );

  const updateTask = (task: TaskId, partial: Partial<TaskState>) => {
    setTasks((prev) => ({
      ...prev,
      [task]: { ...prev[task], ...partial },
    }));
  };

  const promptForTask = useMemo(
    () =>
      ({
        image: `You are a vision expert. Analyze the image at: ${imageUrl || DEFAULT_IMAGE}. Describe objects, text (OCR), scene, and return a short bullet summary plus JSON tags.`,
        video: `You are a video analyst. Without downloading, reason about the video at ${videoUrl || DEFAULT_VIDEO}. Provide a timeline of likely scenes, key subjects, and any actions. Keep it concise.`,
        chat: chatPrompt,
        search: `Perform a web-search style reasoning for: "${searchQuery}". Provide top sources with URLs (do not invent impossible links), and a 3-bullet summary.`,
        audio: `Transcribe the audio at ${audioUrl || DEFAULT_AUDIO}. Return verbatim transcript and a 2-bullet summary.`,
        models: `Evaluate every open-source model connected via Puter or Ollama. Prompt: "${allModelPrompt}". Respond with a checklist of models and their readiness.`,
      }) satisfies Record<TaskId, string>,
    [imageUrl, videoUrl, chatPrompt, searchQuery, audioUrl, allModelPrompt]
  );

  const runTask = async (task: TaskId) => {
    updateTask(task, { status: "running", output: "", error: undefined });
    const model = taskModel(task);
    const system =
      "You are INCLAW's multimodal operator. Use the requested open-source model. Keep answers concise, structured, and cite URLs when possible.";
    const messages: PuterMessage[] = [
      { role: "system", content: system },
      { role: "user", content: promptForTask[task] },
    ];

    try {
      const full = await streamPuterChat(messages, {
        model,
        onToken: (_, fullText) => updateTask(task, { output: fullText }),
      });
      updateTask(task, { status: "done", output: full });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to reach Puter. Confirm js.puter.com is accessible or try again.";
      updateTask(task, { status: "error", error: message });
    }
  };

  return (
    <section id="puter" className="mx-auto mt-16 w-full max-w-6xl rounded-3xl border border-white/5 bg-gradient-to-br from-[#0b031c] via-[#050014] to-[#0a001a] p-8 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-orange-400">Puter.js Cloud</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Multimodal Lab — Image, Video, Chat, Search, Audio</h2>
          <p className="mt-1 text-sm text-slate-400">
            Streams directly from Puter&apos;s open-source models. Auto-routes to vision, reasoning, and transcription backends.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <InclawLogo size={40} animated />
          <div className="text-xs text-slate-300">
            <div className="font-semibold text-white">INCLAW · Open Source</div>
            <div className={puterReady ? "text-emerald-400" : "text-amber-400"}>
              {puterReady ? "Puter ready" : "Loading Puter SDK..."}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {MODEL_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedModel(option.id)}
            className={`rounded-xl border px-3 py-2 text-xs transition ${
              selectedModel === option.id
                ? "border-orange-500/60 bg-orange-500/10 text-white"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-orange-400/40"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <TaskCard
          title="Image analysis"
          description="Vision inspection with OCR and tagging."
          icon={<ImageIcon className="h-5 w-5 text-cyan-300" />}
          input={imageUrl}
          onInputChange={setImageUrl}
          placeholder={DEFAULT_IMAGE}
          cta="Analyze image"
          taskState={tasks.image}
          onRun={() => runTask("image")}
          puterReady={puterReady}
        />
        <TaskCard
          title="Video analysis"
          description="Scene breakdown and highlights."
          icon={<Video className="h-5 w-5 text-purple-300" />}
          input={videoUrl}
          onInputChange={setVideoUrl}
          placeholder={DEFAULT_VIDEO}
          cta="Analyze video"
          taskState={tasks.video}
          onRun={() => runTask("video")}
          puterReady={puterReady}
        />
        <TaskCard
          title="Chat & code"
          description="General reasoning and code chat."
          icon={<Bot className="h-5 w-5 text-emerald-300" />}
          input={chatPrompt}
          onInputChange={setChatPrompt}
          placeholder="Ask INCLAW anything..."
          cta="Chat now"
          taskState={tasks.chat}
          onRun={() => runTask("chat")}
          puterReady={puterReady}
        />
        <TaskCard
          title="Web search"
          description="Search-style responses with cited links."
          icon={<Search className="h-5 w-5 text-sky-300" />}
          input={searchQuery}
          onInputChange={setSearchQuery}
          placeholder="Search for..."
          cta="Search"
          taskState={tasks.search}
          onRun={() => runTask("search")}
          puterReady={puterReady}
        />
        <TaskCard
          title="Audio → Text"
          description="Transcription and summary."
          icon={<Mic2 className="h-5 w-5 text-amber-300" />}
          input={audioUrl}
          onInputChange={setAudioUrl}
          placeholder={DEFAULT_AUDIO}
          cta="Transcribe"
          taskState={tasks.audio}
          onRun={() => runTask("audio")}
          puterReady={puterReady}
        />
        <TaskCard
          title="All models pulse check"
          description="Ping every open-source backend and report status."
          icon={<Sparkles className="h-5 w-5 text-pink-300" />}
          input={allModelPrompt}
          onInputChange={setAllModelPrompt}
          placeholder="Ask for status across models..."
          cta="Run diagnostics"
          taskState={tasks.models}
          onRun={() => runTask("models")}
          puterReady={puterReady}
        />
      </div>
    </section>
  );
}

function TaskCard({
  title,
  description,
  icon,
  input,
  onInputChange,
  placeholder,
  cta,
  taskState,
  onRun,
  puterReady,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  input: string;
  onInputChange: (val: string) => void;
  placeholder?: string;
  cta: string;
  taskState: TaskState;
  onRun: () => void;
  puterReady: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            {icon}
            {title}
          </div>
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>
        {taskState.status === "done" && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
      </div>

      <input
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-[#0b031c] px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-orange-400/60 focus:outline-none"
      />

      <button
        onClick={onRun}
        disabled={!puterReady || taskState.status === "running"}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {taskState.status === "running" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
        {puterReady ? cta : "Loading Puter..."}
      </button>

      <div className="min-h-[96px] rounded-xl border border-white/5 bg-[#080016] p-3 text-xs text-slate-300">
        {taskState.status === "running" && (
          <div className="flex items-center gap-2 text-amber-300">
            <Loader2 className="h-3 w-3 animate-spin" /> Streaming...
          </div>
        )}
        {taskState.output && <pre className="whitespace-pre-wrap">{taskState.output}</pre>}
        {taskState.status === "error" && (
          <div className="text-rose-300">{taskState.error || "Something went wrong."}</div>
        )}
        {!taskState.output && taskState.status === "idle" && (
          <div className="text-slate-600">Output will appear here.</div>
        )}
      </div>
    </div>
  );
}
