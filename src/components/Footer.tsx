"use client";

import Link from "next/link";
import { GitFork, ExternalLink, Heart } from "lucide-react";
import InclawLogo from "@/components/InclawLogo";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#010008]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-3">
              <InclawLogo size={32} />
              <span className="text-lg font-extrabold">
                <span className="text-gradient-saffron">INC</span>
                <span className="text-gradient-cyan">LAW</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-600">
              India&apos;s open-source agentic AI. Built on the best open models for
              developers everywhere.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Product</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              {[
                { href: "/chat",     label: "Chat Agent" },
                { href: "#features", label: "Features" },
                { href: "#models",   label: "Models" },
                { href: "#demo",     label: "Demo" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-orange-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Resources</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              {["Documentation", "API Reference", "Supabase Schema", "Changelog"].map((item) => (
                <li key={item}>
                  <a href="#" className="transition-colors hover:text-orange-400">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Community</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 transition-colors hover:text-orange-400">
                  <GitFork className="h-3.5 w-3.5" /> GitHub
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 transition-colors hover:text-orange-400">
                  <ExternalLink className="h-3.5 w-3.5" /> Twitter / X
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-slate-700">
            © {new Date().getFullYear()} INCLAW. MIT License. Open source and free forever.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-slate-700">
            Made with <Heart className="h-3 w-3 text-red-400" /> in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
