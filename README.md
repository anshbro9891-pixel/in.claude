# INCLAW 🇮🇳

**India's Open-Source AI Coding Agent**

INCLAW is a powerful agentic AI system that writes, debugs, and optimizes production-grade code. Built entirely on open-source large language models — no black boxes, no vendor lock-in.

![INCLAW](https://img.shields.io/badge/Made_in-India-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Open Source](https://img.shields.io/badge/100%25-Open_Source-green?style=for-the-badge)

## ✨ Features

- **Agentic Code Generation** — Plans, reasons, and generates entire modules with context awareness
- **Multi-Model Architecture** — Leverages CodeLlama, DeepSeek Coder, StarCoder2, Mixtral, Llama 3, and Qwen2.5 Coder
- **619+ Languages** — Write code in virtually any programming language
- **Intelligent Debugging** — Paste errors, get fixes with root cause analysis
- **100% Open Source** — Every model, every line of code is open and auditable
- **Made in India** — Supporting Digital India and Atmanirbhar Bharat in AI

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/anshbro9891-pixel/in.claude.git
cd in.claude

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.
Navigate to [http://localhost:3000/chat](http://localhost:3000/chat) to use the AI chat agent.

## 🏗️ Architecture

INCLAW uses a multi-model routing architecture:

```
User Prompt → INCLAW Agent → Model Router → Best Open-Source LLM → Response
```

### Supported Open-Source Models

| Model | Provider | Parameters | Strengths |
|-------|----------|------------|-----------|
| CodeLlama 34B | Meta | 34B | Code Generation, Completion, Debugging |
| DeepSeek Coder 33B | DeepSeek AI | 33B | Multi-language, Code Reasoning |
| StarCoder2 15B | BigCode/HF | 15B | 619 Languages, Fill-in-Middle |
| Mixtral 8x7B | Mistral AI | 46.7B | Reasoning, Multi-task |
| Llama 3 70B | Meta | 70B | Advanced Reasoning, Code Quality |
| Qwen2.5 Coder 32B | Alibaba Cloud | 32B | Code Repair, Agentic Coding |

## 🔌 Connecting to LLM Backends

INCLAW is designed to connect to any open-source LLM inference backend:

### Ollama (Local)
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model
ollama pull codellama:34b

# INCLAW will connect to http://localhost:11434
```

### HuggingFace Inference API
```bash
# Set your API key
export HF_TOKEN=your_token_here
```

### vLLM (Production)
```bash
# Start vLLM server
python -m vllm.entrypoints.openai.api_server \
  --model codellama/CodeLlama-34b-Instruct-hf
```

## 🛠️ Tech Stack

- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Code Highlighting**: React Syntax Highlighter
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts       # Chat API endpoint
│   │   └── models/route.ts     # Models listing API
│   ├── chat/
│   │   ├── layout.tsx          # Chat page layout
│   │   └── page.tsx            # Chat interface
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── AboutSection.tsx        # About section
│   ├── DemoSection.tsx         # Code demo section
│   ├── FeaturesSection.tsx     # Features grid
│   ├── Footer.tsx              # Site footer
│   ├── HeroSection.tsx         # Hero with animations
│   ├── ModelsSection.tsx       # Model cards
│   └── Navbar.tsx              # Navigation bar
└── lib/
    └── constants.ts            # Models, features, demo data
```

## 📄 License

MIT License — free for personal and commercial use.

## 🇮🇳 Made in India

INCLAW represents India's growing strength in AI. Built by Indian engineers, for developers everywhere. Supporting the vision of **Digital India** and **Atmanirbhar Bharat** in artificial intelligence.
