"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Lock, Cpu, Trash2, LogOut, Save, Check, AlertCircle, ArrowLeft,
  Key, Database, ChevronRight, Shield,
} from "lucide-react";
import InclawLogo from "@/components/InclawLogo";
import { getCurrentUser, updateProfile, signOut, resetPassword, type AuthUser } from "@/lib/auth";
import { SUPPORTED_MODELS } from "@/lib/constants";

type Tab = "profile" | "models" | "api" | "security" | "account";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "profile",  label: "Profile",   icon: User   },
  { id: "models",   label: "Models",    icon: Cpu    },
  { id: "api",      label: "API Keys",  icon: Key    },
  { id: "security", label: "Security",  icon: Shield },
  { id: "account",  label: "Account",   icon: Database },
];

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser]           = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Profile
  const [name, setName]           = useState("");
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Model prefs
  const [defaultModel, setDefaultModel] = useState("qwen2.5-coder-32b");

  // API settings (stored in localStorage, never sent to server)
  const [ollamaUrl, setOllamaUrl]   = useState("");
  const [hfToken, setHfToken]       = useState("");
  const [vllmUrl, setVllmUrl]       = useState("");
  const [apiSaved, setApiSaved]     = useState(false);

  // Security
  const [resetSent, setResetSent]   = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    const u = await getCurrentUser();
    if (!u) { router.push("/login"); return; }
    setUser(u);
    setName(u.name ?? "");
  }, [router]);

  useEffect(() => {
    const id = setTimeout(() => {
      void loadUser();
      setOllamaUrl(localStorage.getItem("inclaw_ollama_url") ?? "http://localhost:11434");
      setHfToken(localStorage.getItem("inclaw_hf_token") ?? "");
      setVllmUrl(localStorage.getItem("inclaw_vllm_url") ?? "");
      setDefaultModel(localStorage.getItem("inclaw_default_model") ?? "qwen2.5-coder-32b");
    }, 0);
    return () => clearTimeout(id);
  }, [loadUser]);

  const handleSaveProfile = async () => {
    setSaving(true); setProfileError(null);
    const { error } = await updateProfile(name.trim());
    setSaving(false);
    if (error) { setProfileError(error); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSaveApi = () => {
    localStorage.setItem("inclaw_ollama_url", ollamaUrl);
    localStorage.setItem("inclaw_hf_token", hfToken);
    localStorage.setItem("inclaw_vllm_url", vllmUrl);
    localStorage.setItem("inclaw_default_model", defaultModel);
    setApiSaved(true);
    setTimeout(() => setApiSaved(false), 2500);
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    setResetError(null);
    const { error } = await resetPassword(user.email);
    if (error) { setResetError(error); return; }
    setResetSent(true);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020010]">
        <div className="h-8 w-8 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020010]">
      <div className="absolute inset-0 bg-neural pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 scanlines opacity-[0.025] pointer-events-none" />

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#020010]/85 backdrop-blur-2xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
            <span className="text-slate-700">·</span>
            <div className="flex items-center gap-2">
              <InclawLogo size={22} />
              <span className="text-sm font-bold text-slate-300">Settings</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-xs font-bold text-white">
              {(user.name ?? user.email)[0].toUpperCase()}
            </div>
            <span className="hidden text-xs text-slate-500 sm:block">{user.email}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">

          {/* ── Sidebar ── */}
          <aside className="lg:w-52 shrink-0">
            <nav className="flex flex-row flex-wrap gap-1 lg:flex-col">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all ${
                      activeTab === tab.id
                        ? "bg-orange-500/12 text-orange-300 border border-orange-500/20"
                        : "text-slate-500 hover:bg-white/4 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {tab.label}
                    {activeTab === tab.id && <ChevronRight className="ml-auto h-3 w-3 hidden lg:block" />}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ── Main panel ── */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >

                {/* ── PROFILE ── */}
                {activeTab === "profile" && (
                  <SettingsCard title="Profile" description="Update your display name and account info.">
                    <div className="space-y-5">
                      {/* Avatar */}
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-2xl font-black text-white shadow-lg shadow-orange-500/20">
                          {(user.name ?? user.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{user.name ?? "No name set"}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                          <p className="mt-0.5 text-xs text-slate-700">Member since {new Date(user.createdAt ?? "").getFullYear() || "—"}</p>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-400">Display name</label>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="auth-input w-full rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-400">Email address</label>
                        <input
                          value={user.email}
                          disabled
                          className="w-full rounded-xl border border-white/5 bg-white/2 px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                        />
                        <p className="mt-1 text-xs text-slate-700">Email cannot be changed via settings.</p>
                      </div>

                      {profileError && (
                        <p className="flex items-center gap-2 text-sm text-red-400">
                          <AlertCircle className="h-4 w-4" /> {profileError}
                        </p>
                      )}

                      <SaveButton saving={saving} saved={saved} onClick={handleSaveProfile} />
                    </div>
                  </SettingsCard>
                )}

                {/* ── MODELS ── */}
                {activeTab === "models" && (
                  <SettingsCard title="Model Preferences" description="Choose your default model and routing behaviour.">
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-xs font-medium text-slate-400">Default model</label>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {SUPPORTED_MODELS.map((m) => (
                            <button
                              key={m.id}
                              onClick={() => setDefaultModel(m.id)}
                              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                                defaultModel === m.id
                                  ? "border-orange-500/40 bg-orange-500/8 text-white"
                                  : "border-white/5 bg-white/2 text-slate-500 hover:border-white/10 hover:text-white"
                              }`}
                            >
                              <div className={`h-2 w-2 rounded-full ${defaultModel === m.id ? "bg-orange-400" : "bg-slate-700"}`} />
                              <div className="min-w-0">
                                <p className="truncate text-xs font-medium">{m.name}</p>
                                <p className="text-xs text-slate-600">{m.parameters}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <SaveButton saving={false} saved={apiSaved} onClick={handleSaveApi} label="Save preferences" />
                    </div>
                  </SettingsCard>
                )}

                {/* ── API KEYS ── */}
                {activeTab === "api" && (
                  <SettingsCard title="API Configuration" description="Connect your inference backends. Stored locally in your browser — never sent to our servers.">
                    <div className="space-y-5">
                      <ApiField
                        label="Ollama URL"
                        value={ollamaUrl}
                        onChange={setOllamaUrl}
                        placeholder="http://localhost:11434"
                        hint="Local Ollama server — free, no API key needed"
                      />
                      <ApiField
                        label="HuggingFace API Token"
                        value={hfToken}
                        onChange={setHfToken}
                        placeholder="hf_..."
                        hint="Free tier available at huggingface.co/settings/tokens"
                        secret
                      />
                      <ApiField
                        label="OpenAI-compatible endpoint (vLLM / TGI)"
                        value={vllmUrl}
                        onChange={setVllmUrl}
                        placeholder="http://your-vllm-server:8000"
                        hint="Any OpenAI-compatible /v1/chat/completions endpoint"
                      />
                      <SaveButton saving={false} saved={apiSaved} onClick={handleSaveApi} label="Save API settings" />
                    </div>
                  </SettingsCard>
                )}

                {/* ── SECURITY ── */}
                {activeTab === "security" && (
                  <SettingsCard title="Security" description="Manage your password and active sessions.">
                    <div className="space-y-5">
                      <div className="rounded-xl border border-white/8 bg-white/2 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-white">Password</p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              We&apos;ll send a password reset link to <span className="text-slate-300">{user.email}</span>
                            </p>
                          </div>
                          {resetSent ? (
                            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                              <Check className="h-3.5 w-3.5" /> Email sent
                            </span>
                          ) : (
                            <button
                              onClick={handleResetPassword}
                              className="shrink-0 rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-white transition-all hover:border-orange-500/30 hover:bg-orange-500/5"
                            >
                              <Lock className="inline h-3.5 w-3.5 mr-1.5" />
                              Reset password
                            </button>
                          )}
                        </div>
                        {resetError && <p className="mt-3 text-xs text-red-400">{resetError}</p>}
                      </div>
                    </div>
                  </SettingsCard>
                )}

                {/* ── ACCOUNT ── */}
                {activeTab === "account" && (
                  <SettingsCard title="Account" description="Manage your account and data.">
                    <div className="space-y-4">

                      {/* Sign out */}
                      <div className="rounded-xl border border-white/8 bg-white/2 p-5">
                        <p className="text-sm font-medium text-white mb-1">Sign out</p>
                        <p className="text-xs text-slate-500 mb-4">Sign out of this browser session.</p>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition-all hover:border-white/20 hover:bg-white/4"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </div>

                      {/* Danger zone */}
                      <div className="rounded-xl border border-red-500/15 bg-red-500/4 p-5">
                        <p className="text-sm font-medium text-red-400 mb-1">Danger Zone</p>
                        <p className="text-xs text-slate-500 mb-4">
                          Permanently delete your account and all chat history. This action cannot be undone.
                        </p>
                        <button className="flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 transition-all hover:bg-red-500/8">
                          <Trash2 className="h-4 w-4" />
                          Delete account
                        </button>
                      </div>
                    </div>
                  </SettingsCard>
                )}

              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

/* ── Helper components ── */

function SettingsCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/6 bg-[#030018]/60 p-6 backdrop-blur-xl">
      <div className="mb-6">
        <h2 className="text-base font-bold text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {children}
    </div>
  );
}

function SaveButton({
  saving, saved, onClick, label = "Save changes",
}: { saving: boolean; saved: boolean; onClick: () => void; label?: string }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={saving}
      whileTap={{ scale: 0.97 }}
      className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
        saved
          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
          : "bg-orange-500/15 text-orange-300 border border-orange-500/25 hover:bg-orange-500/20"
      }`}
    >
      {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-400/30 border-t-orange-400" />
               : saved ? <Check className="h-4 w-4" />
               : <Save className="h-4 w-4" />}
      {saved ? "Saved!" : saving ? "Saving…" : label}
    </motion.button>
  );
}

function ApiField({
  label, value, onChange, placeholder, hint, secret = false,
}: { label: string; value: string; onChange: (v: string) => void; placeholder: string; hint: string; secret?: boolean }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-400">{label}</label>
      <div className="relative">
        <input
          type={secret && !show ? "password" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="auth-input w-full rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-sm font-mono text-white placeholder-slate-600 outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
        />
        {secret && (
          <button type="button" onClick={() => setShow(!show)} tabIndex={-1}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white">
            {show ? <span className="text-xs">Hide</span> : <span className="text-xs">Show</span>}
          </button>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-700">{hint}</p>
    </div>
  );
}
