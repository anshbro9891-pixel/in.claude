# INCLAW Pre-Training Pipeline

Detailed specification for Phase 1 of INCLAW training: large-scale pre-training from scratch.

---

## 🎯 Objective

Train INCLAW's base language model on 5T+ tokens of diverse, high-quality text data to establish strong foundational capabilities in language understanding, reasoning, code, and knowledge.

---

## 📊 Data Pipeline

### Data Sources & Mix

```
Total: ~5T tokens

┌────────────────────────────┐
│ Web Text (60%)      3.0T   │ ← FineWeb + DCLM Baseline
├────────────────────────────┤
│ Educational (15%)   750B   │ ← FineWeb-Edu + Cosmopedia
├────────────────────────────┤
│ Code (10%)          500B   │ ← The Stack v2 (permissive)
├────────────────────────────┤
│ Scientific (5%)     250B   │ ← ArXiv + peS2o
├────────────────────────────┤
│ Wikipedia (3%)      150B   │ ← All languages
├────────────────────────────┤
│ Math (3%)           150B   │ ← OpenWebMath + Proof-Pile-2
├────────────────────────────┤
│ Books (2%)          100B   │ ← Project Gutenberg
├────────────────────────────┤
│ Conversation (2%)   100B   │ ← UltraChat (filtered)
└────────────────────────────┘
```

### Data Processing Steps

```
Raw Data
    │
    ▼
┌──────────────────┐
│ 1. Language ID    │ ← fastText lid.176
│    (keep EN 70%,  │
│     multilingual  │
│     30%)          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 2. Quality Filter │ ← Perplexity (KenLM) + classifier
│    Remove:        │    Remove low-quality, spam,
│    - Boilerplate  │    machine-generated filler
│    - Duplicates   │
│    - Low quality  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 3. Deduplication  │ ← MinHash (document-level)
│    - Exact dedup  │    + exact substring matching
│    - Near dedup   │
│    (SimHash/MinH) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 4. PII Removal    │ ← Regex patterns + NER model
│    - Emails       │
│    - Phone #s     │
│    - SSNs, etc.   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 5. Toxicity Filter│ ← Classifier (optional threshold)
│    (configurable  │
│     threshold)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 6. Tokenization   │ ← Custom BPE tokenizer
│    128K vocab      │    (SentencePiece / tiktoken)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 7. Packing &      │ ← Pack multiple docs to max_seq_len
│    Shuffling       │    with document boundaries
└────────┬─────────┘
         │
         ▼
  Training-ready data
```

### Tokenizer Training

```yaml
tokenizer:
  type: "BPE"
  library: "sentencepiece"  # or tiktoken
  vocab_size: 128256
  
  training_data:
    # Representative sample from each domain
    - web_text: 10GB sample
    - code: 5GB sample (all languages)
    - math: 2GB sample (including LaTeX)
    - multilingual: 5GB sample (top 20 languages)
  
  special_tokens:
    - "<|begin_of_text|>"
    - "<|end_of_text|>"
    - "<|start_header_id|>"
    - "<|end_header_id|>"
    - "<|eot_id|>"
    - "<|finetune_right_pad_id|>"
    - "<img>"
    - "</img>"
    - "<tool_call>"
    - "</tool_call>"
    # Reserve 256 tokens for future special tokens
  
  settings:
    byte_fallback: true       # Handle any byte sequence
    split_digits: true        # Each digit is a separate token
    normalization: "NFC"      # Unicode normalization
```

---

## 🖥️ Training Configuration

### Hardware Setup

```yaml
hardware:
  gpus: 512
  gpu_type: "NVIDIA H100 80GB SXM"
  gpu_memory: 80GB
  interconnect:
    intra_node: "NVLink (900 GB/s)"
    inter_node: "InfiniBand NDR (400 Gb/s)"
  nodes: 64  # 8 GPUs per node
  storage:
    type: "Lustre / GPFS"
    capacity: 500TB
    bandwidth: "100+ GB/s aggregate"
```

### Parallelism Strategy

```yaml
parallelism:
  tensor_parallel: 8       # 8 GPUs share each layer
  pipeline_parallel: 4     # 4 pipeline stages
  data_parallel: 16        # 16 data parallel replicas
  # Total: 8 × 4 × 16 = 512 GPUs
  
  sequence_parallel: true  # Shard LayerNorm/Dropout across TP group
  
  # For MoE variant:
  expert_parallel: 8       # Distribute experts across 8 GPUs
```

### Training Loop

```yaml
training:
  # Optimizer
  optimizer: "AdamW"
  learning_rate: 3.0e-4
  min_learning_rate: 3.0e-5
  lr_schedule: "cosine_with_warmup"
  warmup_steps: 2000
  weight_decay: 0.1
  adam_beta1: 0.9
  adam_beta2: 0.95
  adam_epsilon: 1.0e-8
  gradient_clip: 1.0
  
  # Batch size
  global_batch_size_tokens: 4_194_304  # ~4M tokens
  micro_batch_size: 4                   # Per GPU
  gradient_accumulation: 32
  
  # Sequence
  max_seq_length: 8192
  
  # Precision
  compute_dtype: "bfloat16"
  param_dtype: "bfloat16"
  
  # Steps
  total_steps: ~1_200_000   # 5T tokens / 4M per step
  
  # Memory optimization
  activation_checkpointing: true
  flash_attention: true
  
  # Monitoring & checkpointing
  log_interval: 10          # Log every 10 steps
  eval_interval: 500        # Evaluate every 500 steps
  save_interval: 1000       # Save checkpoint every 1000 steps
  keep_checkpoints: 5       # Keep last 5 checkpoints
```

---

## 📈 Monitoring & Validation

### Metrics to Track

```yaml
monitoring:
  training_metrics:
    - training_loss (overall + per domain)
    - learning_rate
    - gradient_norm
    - tokens_per_second
    - gpu_utilization
    - memory_usage
    - communication_overhead
    
  validation_metrics:
    - validation_loss (per domain holdout)
    - validation_perplexity
    
  periodic_benchmarks:
    # Run every 50K steps
    - MMLU (5-shot): "Track knowledge acquisition"
    - HellaSwag (10-shot): "Track common sense reasoning"
    - HumanEval (0-shot): "Track code generation"
    - GSM8K (8-shot): "Track math reasoning"
    
  infrastructure:
    - GPU temperature
    - Network bandwidth utilization
    - Storage I/O throughput
    - Job health (detect stragglers)
```

### Expected Training Curves

```
Loss:
  - Initial: ~10-11 (random)
  - After 10K steps: ~3.5
  - After 100K steps: ~2.5
  - After 500K steps: ~2.0
  - Final (~1.2M steps): ~1.7-1.8

MMLU:
  - 100K steps: ~40%
  - 500K steps: ~60%
  - 1M steps: ~70%
  - Final: ~75% (base model, before fine-tuning)

HumanEval:
  - 100K steps: ~20%
  - 500K steps: ~40%
  - Final: ~50% (base, before instruction tuning)
```

---

## ⚠️ Failure Modes & Mitigations

| Failure Mode | Detection | Mitigation |
|-------------|-----------|------------|
| Loss spike | Loss > 2× running average | Roll back to last checkpoint, reduce LR |
| Loss divergence | NaN/Inf in loss | Reduce LR, check data for corruption |
| GPU failure | Node health check | Auto-restart from checkpoint, elastic training |
| Data pipeline stall | Low GPU utilization | Pre-fetch buffer, async data loading |
| Gradient explosion | Gradient norm > 10× average | Gradient clipping, reduce LR |
| Catastrophic forgetting | Domain loss increases | Adjust data mix, increase diversity |

---

## 🔄 Curriculum Learning (Optional)

```yaml
curriculum:
  # Start with shorter, simpler data; gradually increase complexity
  
  phase_1:
    steps: 0 - 200K
    max_seq_length: 2048
    data_focus: "high-quality web text, Wikipedia, books"
    
  phase_2:
    steps: 200K - 600K
    max_seq_length: 4096
    data_focus: "add code, scientific papers, math"
    
  phase_3:
    steps: 600K - 1.2M
    max_seq_length: 8192
    data_focus: "full data mix, longer documents"
    
  rationale: "Models learn basic patterns first, then complex ones"
```

---

## 📋 Pre-Training Checklist

- [ ] Tokenizer trained and validated
- [ ] All datasets downloaded and processed
- [ ] Data pipeline verified (correct mix, no data leaks)
- [ ] Model architecture implemented and unit tested
- [ ] Parallelism configuration validated on small scale
- [ ] Checkpointing and recovery tested
- [ ] Monitoring and logging set up
- [ ] Validation splits prepared (per domain)
- [ ] Benchmark evaluation scripts ready
- [ ] Storage capacity verified (checkpoints + data)
- [ ] GPU cluster reserved and tested
- [ ] Communication benchmarks run (NCCL test)
- [ ] Small-scale training run completed (verify loss decreases)
- [ ] Full-scale training launched
- [ ] Regular monitoring during training
- [ ] Final checkpoint selected based on validation metrics
