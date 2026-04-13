# INCLAW — Agentic AI Model

> **I**ntelligent **N**eural **C**ognitive **L**earning **A**gent **W**orkflow

INCLAW is an advanced agentic AI model designed to rival top-tier models like Claude Opus 4.6, GPT-5, and Gemini 2.5 Pro. This repository contains the complete training material catalog, workflow architecture, image integration modules, and evaluation frameworks needed to build, train, and deploy INCLAW.

---

## 📁 Repository Structure

```
in.claude/
├── README.md                          # This file — project overview
├── config/
│   ├── training-config.yaml           # Hyperparameter & training configuration
│   └── model-architecture.yaml        # Model architecture specification
├── training-materials/
│   ├── open-source-models/
│   │   ├── foundation-models.md       # Catalog of open-source foundation models
│   │   ├── fine-tuning-sources.md     # Fine-tuning datasets & techniques
│   │   └── model-weights-registry.md  # Open-weight model registry
│   ├── datasets/
│   │   ├── text-datasets.md           # Text/NLP training datasets
│   │   ├── image-datasets.md          # Vision & multimodal datasets
│   │   ├── code-datasets.md           # Code generation & understanding datasets
│   │   └── instruction-datasets.md    # Instruction-following & RLHF datasets
│   └── platforms/
│       └── open-source-platforms.md   # Open-source AI platforms & tools
├── image-integration/
│   ├── vision-architecture.md         # Image interpretation architecture
│   ├── multimodal-pipeline.md         # Multimodal integration pipeline
│   └── image-benchmarks.md            # Vision benchmarks & evaluation
├── workflow/
│   ├── INCLAW-workflow.md             # Master agentic workflow document
│   ├── pipelines/
│   │   ├── pre-training-pipeline.md   # Stage 1: Pre-training
│   │   ├── fine-tuning-pipeline.md    # Stage 2: Fine-tuning
│   │   └── rlhf-pipeline.md          # Stage 3: RLHF alignment
│   ├── agents/
│   │   ├── agent-architecture.md      # Agentic system design
│   │   ├── tool-use-framework.md      # Tool-use & function-calling
│   │   └── memory-systems.md          # Memory & context management
│   └── evaluation/
│       ├── benchmarks.md              # Benchmark suite
│       └── safety-evaluation.md       # Safety & alignment evaluation
└── docs/
    ├── roadmap.md                     # Development roadmap
    └── contributing.md                # Contribution guidelines
```

---

## 🚀 Quick Start

1. **Review the training materials** — Start with [`training-materials/`](training-materials/) to understand the open-source models, datasets, and platforms available.
2. **Understand the architecture** — Read [`config/model-architecture.yaml`](config/model-architecture.yaml) for the model design.
3. **Follow the workflow** — The master workflow is in [`workflow/INCLAW-workflow.md`](workflow/INCLAW-workflow.md) — it covers every stage from data collection to deployment.
4. **Image integration** — See [`image-integration/`](image-integration/) for the multimodal vision pipeline.
5. **Evaluate** — Use [`workflow/evaluation/`](workflow/evaluation/) to benchmark INCLAW against top models.

---

## 🎯 Design Goals

| Goal | Description |
|------|-------------|
| **Agentic Reasoning** | Autonomous multi-step task execution with planning, tool use, and self-correction |
| **Multimodal Understanding** | Native image interpretation, OCR, chart reading, visual reasoning |
| **Code Generation** | State-of-the-art code writing, debugging, and software engineering |
| **Long Context** | 200K+ token context window with strong recall |
| **Safety & Alignment** | Constitutional AI, RLHF, and robust safety guardrails |
| **Tool Use** | Native function calling, API integration, browser use, file manipulation |
| **Memory** | Persistent memory across sessions, episodic and semantic recall |

---

## 📊 Target Benchmarks

| Benchmark | Target Score | Top Model Reference |
|-----------|-------------|-------------------|
| MMLU | ≥90% | Claude Opus 4.6, GPT-5 |
| HumanEval | ≥95% | Claude Opus 4.6 |
| MATH | ≥85% | Gemini 2.5 Pro |
| GPQA | ≥65% | Claude Opus 4.6 |
| SWE-bench Verified | ≥75% | Claude Opus 4.6 |
| MMMU | ≥70% | Gemini 2.5 Pro |
| MathVista | ≥70% | GPT-5 |
| Agentic Tasks (TAU-bench) | ≥80% | Claude Opus 4.6 |

---

## 📜 License

This project is for educational and research purposes. All referenced open-source models and datasets retain their original licenses. See individual material files for specific licensing information.
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
