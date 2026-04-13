import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "INCLAW Chat — AI Coding Agent",
  description: "Chat with INCLAW, India's open-source AI coding agent",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
