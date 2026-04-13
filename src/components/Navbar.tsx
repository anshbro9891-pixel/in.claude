"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Sparkles, GitFork, Settings, LogOut, LayoutDashboard, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import InclawLogo from "@/components/InclawLogo";
import { onAuthChange, signOut, type AuthUser } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#models",   label: "Models"   },
  { href: "/#demo",     label: "Demo"     },
  { href: "/#about",    label: "About"    },
  { href: "/workspace", label: "Workspace" },
  { href: "/learn",     label: "Learn"    },
];

export default function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [scrolled, setScrolled]         = useState(false);
  const [user, setUser]                 = useState<AuthUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Auth subscription
  useEffect(() => {
    const unsub = onAuthChange((u) => setUser(u));
    return unsub;
  }, []);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut();
    router.push("/");
  };

  const isHome = pathname === "/";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? "border-b border-white/5 bg-[#020010]/88 backdrop-blur-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <InclawLogo size={36} animated className="transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-xl opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-gradient-saffron">INC</span>
              <span className="text-gradient-cyan">LAW</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm text-slate-400 transition-all hover:bg-white/5 hover:text-orange-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="hidden items-center gap-3 md:flex">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2 text-sm text-slate-400 transition-all hover:border-orange-500/40 hover:bg-orange-500/5 hover:text-white"
            >
              <GitFork className="h-3.5 w-3.5" />
              GitHub
            </a>

            {user ? (
              /* ── User menu ── */
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-3 py-2 text-sm transition-all hover:border-orange-500/30 hover:bg-orange-500/5"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-xs font-bold text-white">
                    {(user.name ?? user.email)[0].toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate text-slate-300">
                    {user.name ?? user.email.split("@")[0]}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-white/8 bg-[#030018]/95 shadow-2xl shadow-black/60 backdrop-blur-2xl"
                    >
                      <div className="border-b border-white/5 px-4 py-3">
                        <p className="text-xs font-medium text-white truncate">{user.name ?? "—"}</p>
                        <p className="text-xs text-slate-600 truncate">{user.email}</p>
                      </div>
                      <div className="p-1.5">
                        {[
                          { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard"     },
                          { href: "/chat",       icon: Sparkles,        label: "New chat"      },
                          { href: "/settings",   icon: Settings,        label: "Settings"      },
                          { href: "/settings?tab=profile", icon: User,  label: "Profile"       },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition-all hover:bg-white/6 hover:text-white"
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {item.label}
                          </Link>
                        ))}
                        <div className="my-1 border-t border-white/5" />
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition-all hover:bg-red-500/8 hover:text-red-400"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* ── Auth CTAs ── */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-500/30"
                >
                  <span className="absolute inset-0 -skew-x-12 translate-x-[-110%] bg-white/20 transition-transform duration-700 group-hover:translate-x-[110%]" />
                  <Sparkles className="h-4 w-4" />
                  Get started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/5 bg-[#020010]/97 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-orange-300"
                >
                  {link.label}
                </Link>
              ))}

              <div className="my-2 border-t border-white/5" />

              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-sm font-bold text-white">
                      {(user.name ?? user.email)[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{user.name ?? "—"}</p>
                      <p className="truncate text-xs text-slate-600">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link href="/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <button onClick={handleSignOut} className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-red-500/8 hover:text-red-400">
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-3 text-sm font-semibold text-white"
                  >
                    <Sparkles className="h-4 w-4" /> Get started free
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
