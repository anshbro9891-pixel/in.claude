export interface KnowledgeEntry {
  topic: string;
  content: string;
  keywords?: string[];
}

export const INCLAW_KNOWLEDGE: KnowledgeEntry[] = [
  {
    topic: "about inclaw",
    content: `INCLAW is India's open-source agentic AI coding assistant. 
Built with 9 open-source models. Supports 619+ languages. 
Created by Indian engineers. MIT licensed. 
Website: inclaw.tech`,
    keywords: ["inclaw", "india", "open-source", "open source", "about"],
  },
  {
    topic: "supported models",
    content: `INCLAW uses: CodeLlama 34B for code, DeepSeek Coder 33B 
for debugging, StarCoder2 15B for 619 languages, Mixtral 8x7B 
for reasoning, Llama 3 70B for general questions, 
Qwen2.5 Coder 32B for agentic tasks, Gemma 3 27B for speed, 
Phi-4 14B for math, Llama 3.3 70B for advanced reasoning`,
    keywords: ["model", "models", "ollama", "support", "what models", "which model"],
  },
  {
    topic: "capabilities",
    content: `INCLAW can: write full-stack apps, debug any error, 
explain complex concepts, write tests, refactor code, 
help with system design, answer CS theory questions`,
    keywords: ["capability", "capabilities", "can you", "features", "support"],
  },
];

export function findRelevantKnowledge(query: string): KnowledgeEntry[] {
  if (!query) return [];

  const normalized = query.toLowerCase();

  return INCLAW_KNOWLEDGE.filter((entry) => {
    if (entry.keywords?.some((kw) => normalized.includes(kw))) return true;
    return normalized.includes(entry.topic.toLowerCase());
  });
}
