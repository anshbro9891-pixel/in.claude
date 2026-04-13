"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sparkles, GitFork } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import InclawLogo from "@/components/InclawLogo";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#models",   label: "Models" },
  { href: "#demo",     label: "Demo" },
  { href: "#about",    label: "About" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-[#020010]/85 backdrop-blur-2xl"
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

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 transition-all hover:border-orange-500/40 hover:bg-orange-500/5 hover:text-white"
            >
              <GitFork className="h-4 w-4" />
              GitHub
            </a>
            <Link
              href="/chat"
              className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-500/30"
            >
              {/* Shine sweep */}
              <span className="absolute inset-0 -skew-x-12 translate-x-[-110%] bg-white/20 transition-transform duration-700 group-hover:translate-x-[110%]" />
              <Sparkles className="h-4 w-4" />
              Try INCLAW
            </Link>
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

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/5 bg-[#020010]/95 backdrop-blur-2xl md:hidden"
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
              <Link
                href="/chat"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-3 text-sm font-semibold text-white"
              >
                <Sparkles className="h-4 w-4" />
                Try INCLAW
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
