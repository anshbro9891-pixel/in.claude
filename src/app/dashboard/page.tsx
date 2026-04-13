"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageSquare, Cpu, Settings, LogOut, Plus, Zap,
  TrendingUp, Clock, Code2, ArrowRight, Sparkles,
} from "lucide-react";
import InclawLogo from "@/components/InclawLogo";
import { getCurrentUser, signOut, type AuthUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { SUPPORTED_MODELS } from "@/lib/constants";

interface SessionRow {
  id: string;
  title: string | null;
  updated_at: string;
  model_id: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser]         = useState<AuthUser | null>(null);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading]   = useState(true);

  const loadData = useCallback(async () => {
    const u = await getCurrentUser();
    if (!u) { router.push("/login"); return; }
    setUser(u);

    if (supabase) {
      const { data } = await supabase
        .from("chat_sessions")
        .select("id, title, updated_at, model_id")
        .eq("user_id", u.id)
        .order("updated_at", { ascending: false })
        .limit(8);
      if (data) setSessions(data as SessionRow[]);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    const id = setTimeout(() => { void loadData(); }, 0);
    return () => clearTimeout(id);
  }, [loadData]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020010]">
        <div className="flex flex-col items-center gap-4">
          <InclawLogo size={48} animated />
          <div className="h-0.5 w-32 overflow-hidden rounded-full bg-white/5">
            <motion.div className="h-full bg-gradient-to-r from-orange-500 to-cyan-500" animate={{ x: ["-100%", "200%"] }} transition={{ duration: 1.2, repeat: Infinity }} />
          </div>
        </div>
      </div>
    );
  }

  const modelUsage = SUPPORTED_MODELS.slice(0, 4).map((m, i) => ({
    ...m,
    uses: Math.max(1, sessions.filter(s => s.model_id === m.id).length) + (4 - i),
  }));
  const totalChats = sessions.length;
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="min-h-screen bg-[#020010]">
      <div className="absolute inset-0 bg-neural pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />
      <div className="absolute inset-0 scanlines opacity-[0.02] pointer-events-none" />

      {/* ── Top nav ── */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#020010]/85 backdrop-blur-2xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <InclawLogo size={28} animated />
            <span className="text-base font-extrabold">
              <span className="text-gradient-saffron">INC</span>
              <span className="text-gradient-cyan">LAW</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/settings" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-white transition-all">
              <Settings className="h-4 w-4" />
            </Link>
            <button onClick={handleSignOut} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-white transition-all">
              <LogOut className="h-4 w-4" />
            </button>
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-xs font-bold text-white shadow">
              {(user?.name ?? user?.email ?? "U")[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">

        {/* ── Greeting ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-black text-white">
            {greeting},{" "}
            <span className="text-gradient-saffron">{user?.name?.split(" ")[0] ?? "Developer"}</span>{" "}
            👋
          </h1>
          <p className="mt-1.5 text-slate-500">Your agentic AI workspace is ready.</p>
        </motion.div>

        {/* ── Stats row ── */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: MessageSquare, label: "Total chats",    value: totalChats.toString(),  color: "text-orange-400", bg: "bg-orange-500/8" },
            { icon: Cpu,           label: "Models used",    value: "9",                    color: "text-cyan-400",   bg: "bg-cyan-500/8"   },
            { icon: TrendingUp,    label: "Code sessions",  value: totalChats.toString(),  color: "text-emerald-400",bg: "bg-emerald-500/8"},
            { icon: Zap,           label: "Active backend", value: "Ollama",               color: "text-purple-400", bg: "bg-purple-500/8" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl border border-white/6 bg-[#030018]/60 p-5 backdrop-blur-xl"
            >
              <div className={`mb-3 inline-flex rounded-xl p-2.5 ${stat.bg}`}>
                <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
              </div>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-600 mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Recent sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 rounded-2xl border border-white/6 bg-[#030018]/60 p-6 backdrop-blur-xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Recent conversations</h2>
              <Link href="/chat" className="flex items-center gap-1.5 rounded-lg border border-white/8 px-3 py-1.5 text-xs text-slate-400 hover:border-orange-500/30 hover:text-white transition-all">
                <Plus className="h-3.5 w-3.5" />
                New chat
              </Link>
            </div>

            {sessions.length > 0 ? (
              <div className="space-y-2">
                {sessions.map((s, i) => {
                  const model = SUPPORTED_MODELS.find(m => m.id === s.model_id);
                  return (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.05 }}
                    >
                      <Link
                        href={`/chat?session=${s.id}`}
                        className="group flex items-center gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-white/8 hover:bg-white/3"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/8">
                          <Code2 className="h-4 w-4 text-orange-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-slate-300 group-hover:text-white transition-colors">
                            {s.title ?? "Untitled session"}
                          </p>
                          <p className="text-xs text-slate-700">
                            {model?.name ?? s.model_id} · {new Date(s.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-700 opacity-0 transition-all group-hover:opacity-100 group-hover:text-orange-400" />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="h-10 w-10 text-slate-700 mb-3" />
                <p className="text-sm text-slate-500 mb-4">No conversations yet</p>
                <Link
                  href="/chat"
                  className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-500/25"
                >
                  <Sparkles className="h-4 w-4" />
                  Start your first chat
                </Link>
              </div>
            )}
          </motion.div>

          {/* Right panel */}
          <div className="space-y-5">

            {/* Quick actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-2xl border border-white/6 bg-[#030018]/60 p-5 backdrop-blur-xl"
            >
              <h2 className="mb-4 text-sm font-bold text-white">Quick actions</h2>
              <div className="space-y-2">
                {[
                  { href: "/chat",     icon: Sparkles,  label: "New conversation", color: "text-orange-400" },
                  { href: "/settings?tab=api",   icon: Key,       label: "Connect Ollama",   color: "text-cyan-400"   },
                  { href: "/settings?tab=models",icon: Cpu,       label: "Change model",     color: "text-purple-400" },
                  { href: "/settings",icon: Settings,   label: "Account settings", color: "text-slate-400"  },
                ].map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition-all hover:bg-white/4 hover:text-white"
                  >
                    <action.icon className={`h-4 w-4 ${action.color}`} />
                    {action.label}
                    <ArrowRight className="ml-auto h-3.5 w-3.5 opacity-40" />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Top models */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-white/6 bg-[#030018]/60 p-5 backdrop-blur-xl"
            >
              <h2 className="mb-4 text-sm font-bold text-white">Available models</h2>
              <div className="space-y-2">
                {modelUsage.map((m) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="flex-1 truncate text-xs text-slate-400">{m.name}</span>
                    <span className="text-xs text-slate-700">{m.parameters}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* System clock */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="rounded-2xl border border-white/6 bg-[#030018]/60 p-5 backdrop-blur-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-3.5 w-3.5 text-slate-600" />
                <span className="text-xs text-slate-600">System time</span>
              </div>
              <SystemClock />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <p className="font-mono text-xl font-bold text-white">{time}</p>;
}

// silence unused import warning
function Key(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="M21 2l-9.6 9.6" />
      <path d="M15.5 7.5l3 3L22 7l-3-3" />
    </svg>
  );
}
