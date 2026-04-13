"use client";

import Link from "next/link";
import { Terminal, GitFork, ExternalLink, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#020010]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-cyan-500">
                <Terminal className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold">
                <span className="text-orange-400">INC</span>
                <span className="text-cyan-400">LAW</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-slate-500">
              India&apos;s open-source AI coding agent. Built on the best open
              models for developers everywhere.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Product</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/chat" className="transition-colors hover:text-orange-400">
                  Chat Agent
                </Link>
              </li>
              <li>
                <Link href="#features" className="transition-colors hover:text-orange-400">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#models" className="transition-colors hover:text-orange-400">
                  Models
                </Link>
              </li>
              <li>
                <Link href="#demo" className="transition-colors hover:text-orange-400">
                  Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <a href="#" className="transition-colors hover:text-orange-400">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-orange-400">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-orange-400">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-orange-400">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Community</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-orange-400"
                >
                  <GitFork className="h-4 w-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-orange-400"
                >
                  <ExternalLink className="h-4 w-4" />
                  Twitter / X
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} INCLAW. Open-source under MIT License.
          </p>
          <p className="flex items-center gap-1 text-sm text-slate-500">
            Made with <Heart className="h-3.5 w-3.5 text-red-400" /> in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
