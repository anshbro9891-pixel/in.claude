import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "INCLAW — India's Open-Source AI Coding Agent",
  description:
    "INCLAW is a powerful Indian AI coding agent built on open-source LLMs. Generate, debug, and optimize code with state-of-the-art AI — completely open and free.",
  keywords: [
    "INCLAW",
    "Indian AI",
    "coding agent",
    "open source LLM",
    "AI code generator",
    "agentic AI",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
    >
      <body className="min-h-full flex flex-col bg-[#030014] text-slate-200" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
