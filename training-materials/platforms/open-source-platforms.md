# Open-Source AI Platforms & Tools for INCLAW

Comprehensive catalog of open-source platforms, frameworks, and tools for building, training, and deploying INCLAW.

---

## 🏗️ Training Frameworks

### 1. PyTorch (Meta)
- **Purpose**: Core deep learning framework
- **Source**: `github.com/pytorch/pytorch`
- **License**: BSD-3-Clause
- **Key Features**: Dynamic computation graphs, CUDA support, distributed training
- **Relevance**: Foundation framework for all INCLAW training

### 2. Megatron-LM (NVIDIA)
- **Purpose**: Large-scale model training with 3D parallelism
- **Source**: `github.com/NVIDIA/Megatron-LM`
- **License**: BSD-3-Clause
- **Key Features**:
  - Tensor Parallelism (TP) — splits layers across GPUs
  - Pipeline Parallelism (PP) — splits model stages across GPUs
  - Data Parallelism (DP) — replicates model across GPU groups
  - Sequence Parallelism (SP) — splits long sequences
  - Expert Parallelism (EP) — for MoE models
- **Relevance**: Primary training framework for large-scale INCLAW pre-training

### 3. DeepSpeed (Microsoft)
- **Purpose**: Distributed training optimization
- **Source**: `github.com/microsoft/DeepSpeed`
- **License**: Apache 2.0
- **Key Features**:
  - ZeRO Stage 1/2/3 — optimizer state, gradient, and parameter partitioning
  - ZeRO-Offload — offload to CPU/NVMe
  - Mixed precision training (FP16, BF16, FP8)
  - Pipeline parallelism
  - MoE training support
- **Relevance**: Essential for memory-efficient training of large models

### 4. FSDP / PyTorch Distributed (Meta)
- **Purpose**: Fully Sharded Data Parallelism
- **Source**: Part of PyTorch (`torch.distributed.fsdp`)
- **License**: BSD-3-Clause
- **Key Features**:
  - Native PyTorch integration
  - Full parameter sharding
  - Mixed precision
  - Activation checkpointing
- **Relevance**: Simpler alternative to Megatron for mid-scale training

### 5. Hugging Face Transformers & TRL
- **Purpose**: Model implementation, fine-tuning, and RLHF
- **Source**: `github.com/huggingface/transformers`, `github.com/huggingface/trl`
- **License**: Apache 2.0
- **Key Features**:
  - 200K+ model implementations
  - TRL: SFT, DPO, PPO, KTO trainers
  - PEFT integration (LoRA, QLoRA)
  - Quantization support
- **Relevance**: Primary framework for fine-tuning and alignment

### 6. vLLM
- **Purpose**: High-throughput inference engine
- **Source**: `github.com/vllm-project/vllm`
- **License**: Apache 2.0
- **Key Features**:
  - PagedAttention for efficient KV cache
  - Continuous batching
  - Tensor parallelism for multi-GPU
  - OpenAI-compatible API server
  - Speculative decoding
- **Relevance**: Production inference for INCLAW

### 7. llama.cpp / GGML
- **Purpose**: CPU/GPU inference for quantized models
- **Source**: `github.com/ggerganov/llama.cpp`
- **License**: MIT
- **Key Features**:
  - Runs on CPU, Apple Silicon, CUDA
  - GGUF quantization format (Q4, Q5, Q8)
  - Very low memory footprint
- **Relevance**: Edge deployment of INCLAW

### 8. Axolotl
- **Purpose**: Streamlined fine-tuning
- **Source**: `github.com/axolotl-ai-cloud/axolotl`
- **License**: Apache 2.0
- **Key Features**:
  - YAML-based configuration
  - LoRA, QLoRA, full fine-tuning
  - Multi-dataset mixing
  - Flash Attention integration
- **Relevance**: Rapid prototyping of INCLAW fine-tuning experiments

### 9. LitGPT (Lightning AI)
- **Purpose**: Pre-training and fine-tuning
- **Source**: `github.com/Lightning-AI/litgpt`
- **License**: Apache 2.0
- **Key Features**:
  - Clean, readable implementations of 20+ LLM architectures
  - Multi-GPU training with FSDP
  - LoRA/QLoRA support
  - Quantization and deployment tools
- **Relevance**: Reference implementations for architecture exploration

### 10. torchtune (Meta)
- **Purpose**: PyTorch-native fine-tuning
- **Source**: `github.com/pytorch/torchtune`
- **License**: BSD-3-Clause
- **Key Features**:
  - Native PyTorch, no abstractions
  - LoRA, QLoRA, full fine-tuning
  - RLHF/DPO support
  - Memory-efficient training
- **Relevance**: Clean PyTorch-native fine-tuning pipeline

---

## 📊 Data Processing Platforms

### 1. DataTrove (Hugging Face)
- **Purpose**: Large-scale data processing pipeline
- **Source**: `github.com/huggingface/datatrove`
- **License**: Apache 2.0
- **Features**: Deduplication, quality filtering, tokenization at scale
- **Relevance**: Process CommonCrawl and web data for INCLAW pre-training

### 2. dolma toolkit (AI2)
- **Purpose**: Data curation for LLM training
- **Source**: `github.com/allenai/dolma`
- **License**: Apache 2.0
- **Features**: Taggers, deduplication, mixing, documentation
- **Relevance**: Reference data pipeline for quality-first curation

### 3. RedPajama Data Processing
- **Purpose**: Reproduce LLaMA training data pipeline
- **Source**: `github.com/togethercomputer/RedPajama-Data`
- **License**: Apache 2.0
- **Features**: CommonCrawl processing, quality filtering, dedup
- **Relevance**: Well-documented data pipeline

### 4. text-dedup
- **Purpose**: Text deduplication at scale
- **Source**: `github.com/ChenghaoMou/text-dedup`
- **License**: Apache 2.0
- **Features**: MinHash, SimHash, exact dedup, suffix array dedup
- **Relevance**: Essential for pre-training data quality

---

## 🔧 Evaluation & Benchmarking Platforms

### 1. lm-evaluation-harness (EleutherAI)
- **Purpose**: Standardized LLM evaluation
- **Source**: `github.com/EleutherAI/lm-evaluation-harness`
- **License**: MIT
- **Benchmarks**: 200+ tasks including MMLU, HellaSwag, ARC, GSM8K, etc.
- **Relevance**: Primary evaluation tool for INCLAW

### 2. OpenCompass (Shanghai AI Lab)
- **Purpose**: Comprehensive LLM evaluation
- **Source**: `github.com/open-compass/opencompass`
- **License**: Apache 2.0
- **Benchmarks**: 100+ datasets, code, math, reasoning, multimodal
- **Relevance**: Extended benchmark coverage

### 3. VLMEvalKit
- **Purpose**: Vision-language model evaluation
- **Source**: `github.com/open-compass/VLMEvalKit`
- **License**: Apache 2.0
- **Benchmarks**: MMMU, MathVista, OCRBench, MMBench, etc.
- **Relevance**: Evaluate INCLAW's vision capabilities

### 4. SWE-bench Harness
- **Purpose**: Software engineering evaluation
- **Source**: `github.com/princeton-nlp/SWE-bench`
- **License**: MIT
- **Relevance**: Evaluate INCLAW's code/agent capabilities

### 5. LMSYS Chatbot Arena
- **Purpose**: Human preference evaluation (ELO rating)
- **Source**: `chat.lmsys.org`
- **Relevance**: Real-world comparison against all top models

---

## 🚀 Deployment & Serving Platforms

### 1. vLLM (see above)
### 2. TGI (Text Generation Inference — Hugging Face)
- **Source**: `github.com/huggingface/text-generation-inference`
- **License**: HFOIL
- **Features**: Optimized serving, Flash Attention, quantization, streaming

### 3. SGLang
- **Source**: `github.com/sgl-project/sglang`
- **License**: Apache 2.0
- **Features**: Structured generation, RadixAttention, fast serving

### 4. Ollama
- **Source**: `github.com/ollama/ollama`
- **License**: MIT
- **Features**: Easy local model deployment, GGUF support, model management

### 5. OpenRouter / LiteLLM
- **Purpose**: Unified API for multiple models
- **Source**: `github.com/BerriAI/litellm`
- **License**: MIT
- **Features**: OpenAI-compatible API, 100+ model providers

---

## 🛠️ Agentic & Tool-Use Platforms

### 1. LangChain / LangGraph
- **Purpose**: LLM application framework with agents
- **Source**: `github.com/langchain-ai/langchain`
- **License**: MIT
- **Features**: Tool use, chains, agents, memory, RAG
- **Relevance**: Agent orchestration framework for INCLAW

### 2. CrewAI
- **Purpose**: Multi-agent collaboration framework
- **Source**: `github.com/crewAIInc/crewAI`
- **License**: MIT
- **Features**: Role-based agents, task delegation, collaboration

### 3. AutoGen (Microsoft)
- **Purpose**: Multi-agent conversation framework
- **Source**: `github.com/microsoft/autogen`
- **License**: CC-BY 4.0
- **Features**: Agent communication, tool use, code execution

### 4. DSPy (Stanford)
- **Purpose**: Programming with foundation models
- **Source**: `github.com/stanfordnlp/dspy`
- **License**: MIT
- **Features**: Programmatic prompt optimization, chain-of-thought

### 5. SWE-agent
- **Purpose**: Software engineering agent
- **Source**: `github.com/princeton-nlp/SWE-agent`
- **License**: MIT
- **Features**: GitHub issue resolution, code editing, testing
- **Relevance**: Reference for INCLAW's code agent capabilities

### 6. OpenHands (formerly OpenDevin)
- **Purpose**: Full software development agent
- **Source**: `github.com/All-Hands-AI/OpenHands`
- **License**: MIT
- **Features**: Code editing, terminal, browser, file management

### 7. Browser-Use
- **Purpose**: LLM-powered browser automation
- **Source**: `github.com/browser-use/browser-use`
- **License**: MIT
- **Features**: Web browsing, form filling, data extraction

---

## 📦 Model Optimization Tools

### Quantization
| Tool | Formats | Source |
|------|---------|--------|
| bitsandbytes | INT8, NF4 | `github.com/bitsandbytes-foundation/bitsandbytes` |
| AutoGPTQ | GPTQ (INT4) | `github.com/AutoGPTQ/AutoGPTQ` |
| AutoAWQ | AWQ (INT4) | `github.com/casper-hansen/AutoAWQ` |
| llama.cpp | GGUF (Q2-Q8) | `github.com/ggerganov/llama.cpp` |
| NVIDIA TensorRT-LLM | FP8, INT4, INT8 | `github.com/NVIDIA/TensorRT-LLM` |

### Attention Optimization
| Tool | Description | Source |
|------|-------------|--------|
| Flash Attention 2/3 | Memory-efficient exact attention | `github.com/Dao-AILab/flash-attention` |
| xFormers | Optimized transformer components | `github.com/facebookresearch/xformers` |
| FlexAttention | PyTorch-native flexible attention | Part of PyTorch 2.5+ |

---

## 🔑 Platform Comparison for INCLAW Development

| Platform | Pre-training | Fine-tuning | RLHF | Inference | Ease of Use |
|----------|-------------|-------------|------|-----------|------------|
| Megatron-LM | ⭐⭐⭐ | ⭐⭐ | ❌ | ❌ | ⭐ |
| DeepSpeed | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ❌ | ⭐⭐ |
| HF Transformers + TRL | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| Axolotl | ❌ | ⭐⭐⭐ | ⭐⭐ | ❌ | ⭐⭐⭐ |
| vLLM | ❌ | ❌ | ❌ | ⭐⭐⭐ | ⭐⭐⭐ |
| LitGPT | ⭐⭐ | ⭐⭐⭐ | ❌ | ⭐⭐ | ⭐⭐⭐ |
| torchtune | ⭐ | ⭐⭐⭐ | ⭐⭐ | ❌ | ⭐⭐⭐ |

### Recommended Stack for INCLAW
```
Pre-training:  Megatron-LM + DeepSpeed ZeRO
Fine-tuning:   HF Transformers + TRL (or Axolotl for rapid iteration)
RLHF/DPO:     TRL (SFTTrainer → DPOTrainer → PPOTrainer)
Evaluation:    lm-evaluation-harness + VLMEvalKit + SWE-bench
Inference:     vLLM (production) + llama.cpp (edge)
Agent Runtime: LangGraph + custom tool integration
```
