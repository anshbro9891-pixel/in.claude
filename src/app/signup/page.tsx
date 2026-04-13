"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, ShieldCheck, Sparkles, Zap } from "lucide-react";
import InclawLogo from "@/components/InclawLogo";

interface SignupResponse {
  stored?: boolean;
  message?: string;
  error?: string;
}

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Developer");
  const [intent, setIntent] = useState("Build and ship AI products with open-source models.");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string>("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) {
      setFeedback("Name and email are required.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, intent }),
      });
      const data = (await res.json()) as SignupResponse;

      if (res.ok && !data.error) {
        setStatus("success");
        setFeedback(
          data.stored
            ? "You’re in! We captured your signup."
            : "Saved locally. Configure Supabase service keys to persist signups."
        );
        localStorage.setItem(
          "inclaw:signup",
          JSON.stringify({ name, email, role, intent, ts: Date.now() })
        );
      } else {
        setStatus("error");
        setFeedback(data.error || data.message || "Signup failed. Try again.");
      }
    } catch {
      setStatus("error");
      setFeedback("Network error while saving. Please retry.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020010] text-white">
      <div className="absolute inset-0 bg-neural opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-4 py-12">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <InclawLogo size={44} animated className="drop-shadow-lg" />
            <div className="text-xl font-extrabold leading-tight tracking-tight">
              <span className="text-gradient-saffron">INC</span>
              <span className="text-gradient-cyan">LAW</span>
              <div className="text-[11px] uppercase text-slate-400">Open-source AI Cloud</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-orange-500/40 hover:text-white"
            >
              View Pricing
            </Link>
            <Link
              href="/chat"
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-600 to-pink-500 px-4 py-2 text-xs font-semibold shadow-lg shadow-orange-500/25"
            >
              <Sparkles className="h-4 w-4" />
              Launch Agent
            </Link>
          </div>
        </header>

        <main className="mt-10 grid gap-6 md:grid-cols-[1.3fr_0.9fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(249,115,22,0.08)]">
            <p className="text-xs uppercase tracking-[0.4em] text-orange-400">Sign up</p>
            <h1 className="mt-2 text-3xl font-bold">Join INCLAW</h1>
            <p className="mt-2 text-sm text-slate-400">
              Get early access to the INCLAW workspace, Puter.js multimodal lab, and routed open-source cloud models.
              We default to privacy-first — only the info below is stored.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <FormField label="Full name" value={name} onChange={setName} placeholder="Aarav Sharma" />
              <FormField
                label="Work email"
                value={email}
                onChange={setEmail}
                placeholder="you@company.com"
                type="email"
              />
              <div className="grid gap-3 md:grid-cols-2">
                <FormSelect
                  label="Role"
                  value={role}
                  onChange={setRole}
                  options={["Developer", "Researcher", "Founder", "Student", "Enterprise"]}
                />
                <FormField
                  label="Primary goal"
                  value={intent}
                  onChange={setIntent}
                  placeholder="Ship AI apps with open models."
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:brightness-110 disabled:opacity-60"
              >
                {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                Create account
              </button>

              {feedback && (
                <div
                  className={`rounded-xl border px-3 py-2 text-xs ${
                    status === "success"
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                      : "border-rose-500/40 bg-rose-500/10 text-rose-200"
                  }`}
                >
                  {feedback}
                </div>
              )}
            </form>
          </section>

          <aside className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-b from-[#11052d] via-[#0a0420] to-[#040014] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Always open-source
            </div>
            <p className="text-sm text-slate-400">
              Routes to Puter cloud models and Ollama-compatible backends using your API key. No vendor lock-in.
            </p>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Ollama API Key</span>
                <span className="text-emerald-300">Optional</span>
              </div>
              <code className="mt-2 block rounded-lg bg-black/40 p-3 text-[11px] text-orange-200">
                export OLLAMA_API_KEY=&quot;your-key-here&quot;
              </code>
              <p className="mt-2 text-[12px] text-slate-500">
                Set <strong>OLLAMA_URL</strong> to your cloud endpoint; INCLAW will send authenticated requests for all
                supported models.
              </p>
            </div>
            <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-4 text-xs text-orange-100">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Zap className="h-4 w-4 text-amber-300" />
                Included in your account
              </div>
              <ul className="mt-2 space-y-2">
                <li>• Multimodal Puter lab (image, video, audio, search, chat)</li>
                <li>• Open-source coding models (CodeLlama, DeepSeek, Qwen, Mixtral, Llama 3.3, Gemma)</li>
                <li>• UPI-friendly billing via /pricing</li>
              </ul>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="text-slate-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-white/10 bg-[#0b031c] px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-orange-400/60 focus:outline-none"
      />
    </label>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}) {
  return (
    <label className="block text-sm">
      <span className="text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-white/10 bg-[#0b031c] px-3 py-2 text-sm text-white focus:border-orange-400/60 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#0b031c] text-slate-900">
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
