"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Terminal, GitFork, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030014]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-cyan-500 transition-transform group-hover:scale-110">
              <Terminal className="h-5 w-5 text-white" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-orange-500 to-cyan-500 opacity-40 blur-md transition-opacity group-hover:opacity-70" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-orange-400">INC</span>
              <span className="text-cyan-400">LAW</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm text-slate-400 transition-colors hover:text-orange-400"
            >
              Features
            </Link>
            <Link
              href="#models"
              className="text-sm text-slate-400 transition-colors hover:text-orange-400"
            >
              Models
            </Link>
            <Link
              href="#demo"
              className="text-sm text-slate-400 transition-colors hover:text-orange-400"
            >
              Demo
            </Link>
            <Link
              href="#about"
              className="text-sm text-slate-400 transition-colors hover:text-orange-400"
            >
              About
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition-all hover:border-orange-500/50 hover:text-white"
            >
              <GitFork className="h-4 w-4" />
              Star on GitHub
            </a>
            <Link
              href="/chat"
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-orange-400 hover:to-orange-500 hover:shadow-lg hover:shadow-orange-500/25"
            >
              <Sparkles className="h-4 w-4" />
              Try INCLAW
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:text-white md:hidden"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
            className="border-t border-white/5 bg-[#030014]/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-6">
              <Link
                href="#features"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-slate-400 transition-colors hover:text-orange-400"
              >
                Features
              </Link>
              <Link
                href="#models"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-slate-400 transition-colors hover:text-orange-400"
              >
                Models
              </Link>
              <Link
                href="#demo"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-slate-400 transition-colors hover:text-orange-400"
              >
                Demo
              </Link>
              <Link
                href="#about"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-slate-400 transition-colors hover:text-orange-400"
              >
                About
              </Link>
              <Link
                href="/chat"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-medium text-white"
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
