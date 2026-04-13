# INCLAW Master Agentic Workflow

> The complete end-to-end workflow for building INCLAW — from data collection to deployment as a top-tier agentic AI model.

---

## 🗺️ Workflow Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     INCLAW Development Workflow                          │
│                                                                          │
│  Phase 1          Phase 2          Phase 3         Phase 4               │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐          │
│  │  DATA     │    │  PRE-    │    │  FINE-   │    │  AGENTIC │          │
│  │COLLECTION │───▶│ TRAINING │───▶│ TUNING & │───▶│ TRAINING │          │
│  │& CURATION │    │          │    │ ALIGNMENT│    │& DEPLOY  │          │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘          │
│       │               │               │               │                  │
│  ┌────┴────┐    ┌────┴────┐    ┌────┴────┐    ┌────┴────┐              │
│  │ Collect  │    │ Train   │    │ SFT     │    │ Agent   │              │
│  │ Process  │    │ Base    │    │ DPO/PPO │    │ Tools   │              │
│  │ Filter   │    │ Model   │    │ Vision  │    │ Memory  │              │
│  │ Tokenize │    │ 70B+    │    │ Safety  │    │ Deploy  │              │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘              │
│                                                                          │
│  ═══════════════════════════════════════════════════════════             │
│  CONTINUOUS: Evaluation → Feedback → Iteration                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Data Collection & Curation (Weeks 1-8)

### 1.1 Text Data Collection
```yaml
tasks:
  - name: "Download FineWeb"
    source: "huggingface.co/datasets/HuggingFaceFW/fineweb"
    size: "15T tokens"
    priority: critical
    
  - name: "Download FineWeb-Edu"
    source: "huggingface.co/datasets/HuggingFaceFW/fineweb-edu"
    size: "1.3T tokens"
    priority: critical
    
  - name: "Download DCLM Baseline"
    source: "huggingface.co/datasets/mlfoundations/dclm-baseline-1.0"
    size: "3.8T tokens"
    priority: high
    
  - name: "Download knowledge sources"
    sources:
      - Wikipedia (all languages)
      - ArXiv papers
      - peS2o (scientific papers)
      - StackExchange
      - Project Gutenberg
    priority: high
```

### 1.2 Code Data Collection
```yaml
tasks:
  - name: "Download The Stack v2"
    source: "huggingface.co/datasets/bigcode/the-stack-v2-dedup"
    focus: "Permissively licensed code"
    priority: critical
    
  - name: "Curate code quality"
    process:
      - Filter by repository stars (>5 preferred)
      - Remove auto-generated code
      - Remove minified/obfuscated code
      - Apply language-specific quality filters
      - Deduplicate across repositories
```

### 1.3 Image-Text Data Collection
```yaml
tasks:
  - name: "Download DataComp-1B"
    source: "huggingface.co/datasets/mlfoundations/datacomp_1b"
    priority: critical
    
  - name: "Download visual instruction data"
    sources:
      - LLaVA-OneVision-Data (3.2M)
      - ShareGPT4V-PT (1.2M)
      - Docmatix (2.4M)
      - Cambrian-7M (subset)
    priority: high
    
  - name: "Download specialized vision data"
    sources:
      - DocVQA, ChartQA, TextVQA
      - MathVista, MMMU, AI2D
      - OCR datasets (FUNSD, CORD)
    priority: medium
```

### 1.4 Instruction & Alignment Data
```yaml
tasks:
  - name: "Download SFT data"
    sources:
      - Tulu 3 SFT Mix (~1M)
      - OpenHermes 2.5 (1M+)
      - WildChat-1M
      - UltraChat 200K
    priority: critical
    
  - name: "Download preference data"
    sources:
      - Tulu 3 Preference Mix (~500K)
      - UltraFeedback Binarized (64K)
      - HH-RLHF (170K)
      - Skywork Reward 80K
    priority: critical
    
  - name: "Download safety data"
    sources:
      - BeaverTails (330K)
      - WildGuard (92K)
      - XSTest (450)
    priority: high
```

### 1.5 Data Processing Pipeline
```yaml
processing:
  text:
    1. "Language identification (fastText)"
    2. "Quality filtering (perplexity + classifier)"
    3. "Deduplication (MinHash at document level)"
    4. "PII removal (regex + NER)"
    5. "Toxicity filtering (classifier-based)"
    6. "Domain classification and tagging"
    
  code:
    1. "License detection per file"
    2. "Language detection"
    3. "Quality scoring (stars, lint results)"
    4. "Deduplication (exact + near-dedup)"
    5. "Secret/credential removal"
    
  images:
    1. "CLIP score filtering (>0.28)"
    2. "NSFW detection and removal"
    3. "Resolution filtering (>224px)"
    4. "Watermark detection"
    5. "Broken image removal"
    
  tokenization:
    vocabulary_size: 128000
    method: "BPE (SentencePiece or tiktoken)"
    special_tokens:
      - "<|begin_of_text|>"
      - "<|end_of_text|>"
      - "<|start_header_id|>"
      - "<|end_header_id|>"
      - "<img>"
      - "</img>"
      - "<tool_call>"
      - "</tool_call>"
      - "<tool_result>"
      - "</tool_result>"
```

---

## Phase 2: Pre-Training (Weeks 6-20)

### 2.1 Architecture Configuration
```yaml
model_architecture:
  # See config/model-architecture.yaml for full specification
  type: "Dense Transformer (start) or MoE (later)"
  
  recommended_starting_point:
    base: "LLaMA 3.1 70B architecture"
    modifications:
      - "Grouped Query Attention (GQA) with 8 KV heads"
      - "RoPE with theta=500000 for 128K context"
      - "SwiGLU activation"
      - "RMSNorm"
      - "Vocabulary: 128K tokens (custom trained)"
```

### 2.2 Pre-Training Execution
```yaml
pre_training:
  data_mix:
    web_text: 60%      # FineWeb + DCLM
    educational: 15%    # FineWeb-Edu + Cosmopedia
    code: 10%           # The Stack v2
    scientific: 5%      # ArXiv + peS2o
    wikipedia: 3%       # All languages
    math: 3%            # OpenWebMath + Proof-Pile-2
    books: 2%           # Project Gutenberg
    conversation: 2%    # UltraChat filtered
  
  hyperparameters:
    total_tokens: 5_000_000_000_000  # 5T tokens minimum
    batch_size: 4_000_000            # 4M tokens per batch
    learning_rate: 3e-4
    min_lr: 3e-5                     # 10x decay
    warmup_steps: 2000
    lr_scheduler: cosine
    weight_decay: 0.1
    adam_beta1: 0.9
    adam_beta2: 0.95
    gradient_clip: 1.0
    precision: bf16
    
  parallelism:
    tensor_parallel: 8
    pipeline_parallel: 4
    data_parallel: 16
    sequence_parallel: true
    # Total GPUs: 8 × 4 × 16 = 512 A100/H100 GPUs
    
  infrastructure:
    framework: "Megatron-LM + DeepSpeed ZeRO-1"
    gpus: "512× NVIDIA H100 80GB"
    interconnect: "NVLink + InfiniBand"
    storage: "Distributed file system (Lustre/GPFS)"
    estimated_time: "~3-4 weeks continuous training"
    
  checkpointing:
    frequency: every_1000_steps
    keep_last: 5
    async_save: true
    
  monitoring:
    - Training loss (per domain)
    - Validation loss (held-out per domain)
    - Learning rate
    - Gradient norm
    - Token throughput (tokens/sec)
    - GPU utilization
    - Periodic eval on MMLU, HumanEval subsets
```

### 2.3 Long Context Extension (Optional — Post Pre-Training)
```yaml
long_context:
  method: "RoPE frequency scaling + continued pre-training"
  
  stages:
    - context: 32K → 64K
      tokens: 50B (long-document heavy)
      lr: 2e-5
      
    - context: 64K → 128K
      tokens: 20B (very long documents)
      lr: 1e-5
      
    - context: 128K → 200K+ (stretch goal)
      tokens: 10B
      lr: 5e-6
  
  data:
    - Long books and documents
    - Concatenated related documents
    - Synthetic needle-in-a-haystack tasks
    - Repository-level code (full repos as context)
```

---

## Phase 3: Fine-Tuning & Alignment (Weeks 18-30)

### 3.1 Supervised Fine-Tuning (SFT)
```yaml
sft:
  data:
    - Tulu 3 SFT Mix: 30%
    - OpenHermes 2.5 (filtered): 20%
    - WildChat-1M (filtered): 15%
    - Code instruction data: 15%
    - UltraChat 200K: 10%
    - Math instruction data: 5%
    - Tool-use data: 5%
  
  hyperparameters:
    epochs: 2
    lr: 2e-5
    warmup_ratio: 0.03
    batch_size: 128
    max_length: 8192
    scheduler: cosine
    
  framework: "HF Transformers + TRL SFTTrainer"
  compute: "64× H100 GPUs, ~3 days"
```

### 3.2 Vision Integration
```yaml
vision_integration:
  # Run in parallel with or after text SFT
  
  stage_a_alignment:
    data: "ShareGPT4V-PT + ALLaVA-Caption"
    trainable: projector_only
    compute: "16× H100, ~12 hours"
    
  stage_b_instruction_tuning:
    data: "LLaVA-OneVision + Docmatix + specialized"
    trainable: all
    mix: "70% multimodal, 30% text-only"
    compute: "64× H100, ~5 days"
```

### 3.3 Direct Preference Optimization (DPO)
```yaml
dpo:
  data:
    - Tulu 3 Preference Mix: 35%
    - UltraFeedback Binarized: 25%
    - HH-RLHF: 20%
    - Skywork Reward 80K: 10%
    - Vision preference data: 10%
  
  hyperparameters:
    epochs: 1
    lr: 5e-7
    beta: 0.1
    batch_size: 64
    max_length: 4096
    
  framework: "TRL DPOTrainer"
  compute: "64× H100, ~2 days"
```

### 3.4 Safety Alignment
```yaml
safety:
  method: "Constitutional AI + Safety DPO"
  
  process:
    1. "Generate responses to safety-sensitive prompts"
    2. "Apply INCLAW constitutional principles to rank"
    3. "Create safety preference pairs"
    4. "DPO on safety pairs"
    5. "Test against XSTest for over-refusal calibration"
    6. "Red-teaming with adversarial prompts"
    
  data:
    - BeaverTails (safety categories)
    - WildGuard (classification)
    - Custom red-team prompts
    - XSTest (calibration)
    
  compute: "32× H100, ~1 day"
```

### 3.5 Reinforcement Learning (Optional — For Top Performance)
```yaml
rl_training:
  method: "PPO or GRPO (Group Relative Policy Optimization)"
  
  reward_model:
    base: "INCLAW-70B-SFT (smaller variant)"
    training_data: "UltraFeedback + Chatbot Arena + Skywork"
    
  ppo_config:
    lr: 1e-6
    kl_penalty: 0.05
    clip_range: 0.2
    rollout_batch: 512
    ppo_epochs: 4
    
  compute: "128× H100, ~1 week"
  
  alternative_grpo:
    # Group Relative Policy Optimization (from DeepSeek-R1)
    # No separate reward model needed
    # Compare multiple outputs per prompt, optimize relatively
    advantage: "Simpler, no reward model training"
```

---

## Phase 4: Agentic Training & Deployment (Weeks 28-40)

### 4.1 Agentic Capability Training
```yaml
agentic_training:
  capabilities:
    tool_use:
      - Function calling (structured JSON output)
      - API interaction
      - Calculator / code execution
      - Web browsing
      - File system operations
      - Database queries
      
    planning:
      - Multi-step task decomposition
      - Goal tracking and progress monitoring
      - Dynamic plan revision
      - Error recovery and retry logic
      
    memory:
      - Short-term context management (within session)
      - Long-term memory retrieval (across sessions)
      - Episodic memory (specific past interactions)
      - Semantic memory (learned facts and patterns)
      
    self_reflection:
      - Output quality assessment
      - Confidence estimation
      - Error detection and correction
      - Asking for clarification when uncertain
  
  training_data:
    - Agent-FLAN (34K trajectories)
    - ToolBench (126K tool-use instances)
    - FireAct (20K ReAct traces)
    - SWE-bench agent traces (successful trajectories)
    - Custom agentic trajectories (generated and filtered)
    
  training_method:
    1. "SFT on successful agent trajectories"
    2. "RL with task completion as reward signal"
    3. "Self-play improvement (generate → evaluate → filter → retrain)"
```

### 4.2 Tool Integration Framework
```yaml
tool_framework:
  # See workflow/agents/tool-use-framework.md for full details
  
  format:
    # Function calling format
    system: "You have access to the following tools: [tool_definitions]"
    user: "User request that requires tool use"
    assistant: |
      I'll help you with that. Let me use the appropriate tool.
      <tool_call>
      {"name": "tool_name", "parameters": {"key": "value"}}
      </tool_call>
    tool_result: |
      <tool_result>
      {"result": "tool output"}
      </tool_result>
    assistant_final: "Based on the tool result, here is my answer..."
  
  built_in_tools:
    - code_execution: "Run Python/JS/shell code"
    - web_search: "Search the internet"
    - web_browse: "Navigate and read web pages"
    - file_operations: "Read, write, edit files"
    - calculator: "Mathematical computation"
    - image_generation: "Create images (via external API)"
```

### 4.3 Deployment
```yaml
deployment:
  inference_engine: "vLLM"
  
  configuration:
    tensor_parallel: 8          # 8 GPUs per instance
    max_model_len: 131072       # 128K context
    gpu_memory_utilization: 0.9
    max_num_seqs: 256           # Concurrent requests
    enforce_eager: false        # Use CUDA graphs
    
  api:
    format: "OpenAI-compatible"
    endpoints:
      - /v1/chat/completions
      - /v1/completions
      - /v1/embeddings
    
  scaling:
    load_balancer: "nginx/envoy"
    auto_scaling: true
    min_replicas: 2
    max_replicas: 16
    target_latency: "<2s for first token"
    
  monitoring:
    - Request latency (P50, P95, P99)
    - Token throughput
    - Error rate
    - GPU utilization
    - Queue depth
```

---

## 📋 Timeline Summary

| Phase | Duration | Key Deliverable | Compute |
|-------|----------|----------------|---------|
| 1. Data Collection | Weeks 1-8 | 5T+ processed tokens, curated datasets | Minimal (storage-heavy) |
| 2. Pre-Training | Weeks 6-20 | INCLAW-70B base model | 512 H100 × 4 weeks |
| 3. Fine-Tuning | Weeks 18-30 | INCLAW-70B-Instruct with vision | 128 H100 × 2 weeks |
| 4. Agentic + Deploy | Weeks 28-40 | Production INCLAW agent | 128 H100 × 1 week |

**Total Estimated Compute**: ~1.5M H100-GPU-hours

---

## 🔄 Continuous Improvement Loop

```
┌───────────────┐
│   Deploy      │
│   INCLAW v1   │
└──────┬────────┘
       │
       ▼
┌───────────────┐     ┌──────────────┐     ┌───────────────┐
│  Collect User │────▶│  Identify    │────▶│  Generate New  │
│  Feedback     │     │  Weaknesses  │     │  Training Data │
└───────────────┘     └──────────────┘     └──────┬────────┘
                                                   │
       ┌───────────────────────────────────────────┘
       │
       ▼
┌───────────────┐     ┌──────────────┐     ┌───────────────┐
│  Fine-tune    │────▶│  Evaluate    │────▶│  Deploy       │
│  on New Data  │     │  on Benchmarks│     │  INCLAW v2    │
└───────────────┘     └──────────────┘     └───────────────┘
```

Each iteration should:
1. Collect user feedback and failure cases
2. Identify systematic weaknesses
3. Generate or collect targeted training data
4. Fine-tune (DPO/SFT) on new data
5. Evaluate on full benchmark suite
6. Deploy if improved, iterate if not
