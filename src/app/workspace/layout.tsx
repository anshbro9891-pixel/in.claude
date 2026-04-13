import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "INCLAW Workspace — AI App Builder",
  description:
    "Build full-stack applications with INCLAW AI. Code editor, live preview, terminal, and 9 open-source models at your fingertips.",
};

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
