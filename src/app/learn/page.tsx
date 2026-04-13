import type { Metadata } from "next";
import LearnClient from "./LearnClient";

export const metadata: Metadata = {
  title: "Learn Agentic AI — INCLAW",
  description:
    "A comprehensive guide to Agentic AI: components, frameworks, challenges, and a hands-on Python tutorial. Powered by INCLAW.",
};

export default function LearnPage() {
  return <LearnClient />;
}
