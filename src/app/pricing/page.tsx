"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Copy, IndianRupee, Link2, Shield, Smartphone } from "lucide-react";
import InclawLogo from "@/components/InclawLogo";
import { SUPPORTED_MODELS } from "@/lib/constants";

const DEFAULT_UPI = process.env.NEXT_PUBLIC_UPI_ID || "inclaw@upi";

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [amount, setAmount] = useState(999);
  const [copied, setCopied] = useState(false);
  const upiId = DEFAULT_UPI;

  const payableAmount = useMemo(
    () => (annual ? Math.max(amount, 0) * 10 : Math.max(amount, 0)),
    [annual, amount]
  );

  const deeplink = useMemo(
    () =>
      `upi://pay?pa=${encodeURIComponent(upiId)}&pn=INCLAW&cu=INR&am=${payableAmount}&tn=INCLAW%20Pro`,
    [upiId, payableAmount]
  );

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#020010] text-white">
      <div className="absolute inset-0 bg-neural opacity-70" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 py-12">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <InclawLogo size={44} animated className="drop-shadow-lg" />
            <div className="text-xl font-extrabold leading-tight tracking-tight">
              <span className="text-gradient-saffron">INC</span>
              <span className="text-gradient-cyan">LAW</span>
              <div className="text-[11px] uppercase text-slate-400">Pricing · UPI ready</div>
            </div>
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-gradient-to-r from-orange-600 to-pink-500 px-4 py-2 text-xs font-semibold shadow-lg shadow-orange-500/25"
          >
            Sign up
          </Link>
        </header>

        <main className="mt-10 space-y-8">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-orange-400">Simple Pricing</p>
                <h1 className="mt-1 text-3xl font-bold">One plan, all INCLAW capabilities</h1>
                <p className="text-sm text-slate-400">
                  Unlimited access to Puter.js cloud models, Ollama-compatible backends, multimodal lab, and workspace.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-xs">
                <button
                  onClick={() => setAnnual(false)}
                  className={`rounded-lg px-3 py-1 font-semibold ${
                    !annual ? "bg-orange-500/20 text-white" : "text-slate-400"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setAnnual(true)}
                  className={`rounded-lg px-3 py-1 font-semibold ${
                    annual ? "bg-orange-500/20 text-white" : "text-slate-400"
                  }`}
                >
                  Annual (save 20%)
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-5">
                <div className="flex items-baseline gap-2">
                  <IndianRupee className="h-6 w-6 text-amber-300" />
                  <span className="text-4xl font-bold">{Math.round(payableAmount)}</span>
                  <span className="text-sm text-slate-300">{annual ? "per year" : "per month"}</span>
                </div>
                <p className="mt-2 text-sm text-orange-100">Pay instantly via UPI deep link.</p>
                <div className="mt-4 grid gap-2 text-sm text-white">
                  <FeatureRow text="All open-source coding models (CodeLlama, DeepSeek, Qwen, Mixtral, Llama 3.3)" />
                  <FeatureRow text="Multimodal lab: image, video, audio, search via Puter.js" />
                  <FeatureRow text="Workspace with browser + terminal actions (permissioned)" />
                  <FeatureRow text="Unlimited chat with auto model routing" />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>UPI ID</span>
                  <button
                    onClick={() => handleCopy(upiId)}
                    className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-[11px] transition hover:border-orange-500/40"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <code className="mt-2 block rounded-lg bg-black/40 p-3 text-sm text-orange-200">{upiId}</code>

                <label className="mt-4 block text-sm text-slate-300">
                  Amount (INR)
                  <input
                    type="number"
                    min={99}
                    max={99999}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || 0)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#0b031c] px-3 py-2 text-sm text-white focus:border-orange-400/60 focus:outline-none"
                  />
                </label>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  Secure UPI · Works with all major apps
                </div>

                <div className="mt-4 grid gap-2">
                  <a
                    href={deeplink}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20"
                  >
                    <Smartphone className="h-4 w-4" />
                    Pay via UPI deep link
                  </a>
                  <a
                    href={deeplink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-orange-500/40"
                  >
                    <Link2 className="h-4 w-4" />
                    Open in UPI app
                  </a>
                </div>

                <p className="mt-3 text-[11px] text-slate-500">
                  Configure <strong>NEXT_PUBLIC_UPI_ID</strong> to use your own handle. We build deeplinks automatically.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Shield className="h-4 w-4 text-emerald-400" />
              Open-source model coverage
            </div>
            <p className="mt-2 text-sm text-slate-400">
              INCLAW talks to every open-source cloud model you connect via Ollama or Puter. Provide your API key and we
              automatically route.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {SUPPORTED_MODELS.map((model) => (
                <div
                  key={model.id}
                  className="rounded-2xl border border-white/10 bg-[#080016] p-4"
                >
                  <div className="text-sm font-semibold text-white">{model.name}</div>
                  <div className="text-xs text-slate-400">
                    {model.provider} · {model.parameters}
                  </div>
                  <div className="mt-2 text-xs text-slate-300">{model.description}</div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    Ollama tag: <code className="text-orange-200">{model.ollamaTag}</code>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function FeatureRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <Check className="mt-0.5 h-4 w-4 text-emerald-400" />
      <span>{text}</span>
    </div>
  );
}
