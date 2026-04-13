# Instruction-Following & RLHF Datasets for INCLAW

Comprehensive catalog of datasets for instruction tuning, alignment, and safety training.

---

## 📋 General Instruction-Following Datasets

### Tier 1: High-Quality Curated

| Dataset | Size | Description | License | Source |
|---------|------|-------------|---------|--------|
| Tulu 3 SFT Mix | ~1M | AI2's curated mix for state-of-the-art alignment | ODC-BY | `allenai/tulu-3-sft-mixture` |
| OpenHermes 2.5 | 1M+ | Curated synthetic instructions from multiple sources | Apache 2.0 | `teknium/OpenHermes-2.5` |
| Magpie-Pro-300K | 300K | High-quality synthetic via LLM self-instruct | Apache 2.0 | `Magpie-Align/Magpie-Pro-300K-Filtered` |
| WildChat-1M | 1M | Real user conversations with GPT models | AI2 ImpACT | `allenai/WildChat-1M` |
| UltraChat 200K | 200K | Cleaned multi-topic dialogues | MIT | `HuggingFaceH4/ultrachat_200k` |
| Aya Collection | 513M | Massive multilingual instruction collection | Apache 2.0 | `CohereForAI/aya_collection` |
| Capybara | 16K | High-quality multi-turn conversations | Apache 2.0 | `LDJnr/Capybara` |

### Tier 2: Supplementary

| Dataset | Size | Description | License | Source |
|---------|------|-------------|---------|--------|
| FLAN Collection | 15M+ | Google's massive task collection | Apache 2.0 | `Muennighoff/flan` |
| Natural Instructions | 1.6K tasks, 5M examples | Diverse NLP task instructions | Apache 2.0 | `allenai/natural-instructions` |
| Self-Instruct | 52K | GPT-3 self-generated instructions | Apache 2.0 | `yizhongw/self_instruct` |
| Dolly 15K | 15K | Databricks employee-written | CC-BY-SA 3.0 | `databricks/databricks-dolly-15k` |
| LIMA | 1K | Carefully curated high-quality examples | CC-BY-NC-SA | `GAIR/lima` |
| SlimOrca | 518K | Cleaned FLAN/Orca data | MIT | `Open-Orca/SlimOrca` |

---

## ⚖️ Preference & Alignment Datasets

### Direct Preference Data (for DPO/KTO/IPO)

| Dataset | Size | Format | License | Source |
|---------|------|--------|---------|--------|
| Tulu 3 Preference Mix | ~500K | Chosen/Rejected pairs | ODC-BY | `allenai/tulu-3-pref-mixture` |
| UltraFeedback | 64K prompts, 256K responses | Multi-model rated by GPT-4 | MIT | `openbmb/UltraFeedback` |
| UltraFeedback Binarized | 64K pairs | Cleaned binary preference pairs | MIT | `HuggingFaceH4/ultrafeedback_binarized` |
| HH-RLHF | 170K comparisons | Helpfulness & harmlessness | MIT | `Anthropic/hh-rlhf` |
| Nectar | 182K conversations | 7-way comparisons ranked by GPT-4 | CC-BY-NC | `berkeley-nest/Nectar` |
| Chatbot Arena | 100K+ battles | Real human preference votes | CC-BY | `lmsys/chatbot_arena_conversations` |
| Skywork Reward 80K | 80K pairs | High-quality reward model training | Apache 2.0 | `Skywork/Skywork-Reward-Preference-80K-v0.2` |
| Argilla DPO Mix | 7K pairs | Curated high-quality pairs | Apache 2.0 | `argilla/dpo-mix-7k` |
| Orca DPO Pairs | 13K pairs | Cleaned preference pairs | MIT | `Intel/orca_dpo_pairs` |

### Reward Model Training Data

| Dataset | Description | Use Case |
|---------|-------------|----------|
| UltraFeedback | 4 responses per prompt with quality ratings | Train reward model |
| HH-RLHF | Binary comparisons with explanations | Helpfulness/harmlessness reward |
| Chatbot Arena data | Elo-rated model comparisons | Calibrated reward signal |
| Skywork Reward data | Carefully annotated preference pairs | High-precision reward model |

---

## 🛡️ Safety & Alignment Datasets

### Safety Training Data

| Dataset | Size | Description | License |
|---------|------|-------------|---------|
| HH-RLHF (Harmlessness) | 43K pairs | Harmlessness preference data | MIT |
| BeaverTails | 330K QA pairs | Safety meta-labels (14 harm categories) | CC-BY-NC 4.0 |
| PKU-SafeRLHF | 330K pairs | Safety preference data | CC-BY-NC 4.0 |
| ToxiGen | 274K statements | Implicit toxicity detection | Apache 2.0 |
| Do-Not-Answer | 939 questions | Questions that LLMs should refuse | CC-BY-SA |
| Aegis AI Content Safety | 12K samples | Multi-category safety classification | Apache 2.0 |
| WildGuard | 92K items | Safety classification & refusal | Apache 2.0 |
| XSTest | 450 prompts | Testing exaggerated safety behavior | MIT |

### Constitutional AI Principles (for RLAIF)

Based on Anthropic's approach, INCLAW should internalize these principles:

```yaml
constitutional_principles:
  helpfulness:
    - "Choose the response that is most helpful, while being safe"
    - "Choose the response that best answers the user's question"
    - "Choose the response that is most informative and accurate"
  
  harmlessness:
    - "Choose the response that is least likely to cause harm"
    - "Choose the response that avoids toxic, biased, or offensive content"
    - "Choose the response that respects user privacy"
  
  honesty:
    - "Choose the response that is most truthful and accurate"
    - "Choose the response that acknowledges uncertainty when appropriate"
    - "Choose the response that avoids making up information"
  
  ethics:
    - "Choose the response that treats all people fairly"
    - "Choose the response that respects human rights and dignity"
    - "Choose the response that does not help with illegal activities"
```

---

## 🔧 Tool Use & Function Calling Datasets

| Dataset | Size | Description | License |
|---------|------|-------------|---------|
| Gorilla API Bench | 16.5K API calls | API function calling | Apache 2.0 |
| ToolBench | 16K+ tools, 126K instances | Massive tool-use dataset | Apache 2.0 |
| ToolAlpaca | 3.9K instances | Tool learning from 400+ tools | Apache 2.0 |
| Glaive Function Calling v2 | 113K | Synthetic function calling | Apache 2.0 |
| NexusRaven Function Calling | 30K+ | Diverse function calling scenarios | Apache 2.0 |
| Agent-FLAN | 34K trajectories | Agentic conversation data | Apache 2.0 |
| AgentInstruct | 1.8K tasks | Agent planning and execution | MIT |
| FireAct | 20K trajectories | ReAct-style agent traces | Apache 2.0 |

---

## 🧠 Reasoning & Chain-of-Thought Datasets

| Dataset | Size | Description | License |
|---------|------|-------------|---------|
| FLAN-CoT | 9M | Chain-of-thought reasoning traces | Apache 2.0 |
| Orca-Math | 200K | Step-by-step math reasoning | MIT |
| MetaMathQA | 395K | Augmented math reasoning | MIT |
| NuminaMath-CoT | 860K | Competition math with solutions | Apache 2.0 |
| Camel-AI Math | 50K | Math problem solving dialogues | CC-BY-NC 4.0 |
| ARC-Challenge (training) | 1.1K | Science reasoning | CC-BY-SA |
| LogiQA | 8.7K | Logical reasoning questions | Research |

---

## 📊 Recommended INCLAW Alignment Pipeline

### Stage 1: Supervised Fine-Tuning (SFT)
```yaml
sft_stage:
  primary_mix:
    - source: tulu-3-sft-mixture
      weight: 0.30
    - source: OpenHermes-2.5 (filtered)
      weight: 0.20
    - source: WildChat-1M (filtered)
      weight: 0.15
    - source: UltraChat-200K
      weight: 0.10
    - source: Magpie-Pro-300K
      weight: 0.10
    - source: Code instruction data (from code-datasets.md)
      weight: 0.10
    - source: FLAN-CoT (subset)
      weight: 0.05
  
  hyperparameters:
    epochs: 2
    lr: 2e-5
    warmup_ratio: 0.03
    lr_scheduler: cosine
    batch_size: 128
    max_length: 8192
```

### Stage 2: Direct Preference Optimization (DPO)
```yaml
dpo_stage:
  primary_mix:
    - source: tulu-3-pref-mixture
      weight: 0.35
    - source: ultrafeedback_binarized
      weight: 0.25
    - source: HH-RLHF
      weight: 0.20
    - source: Skywork-Reward-80K
      weight: 0.10
    - source: argilla-dpo-mix-7k
      weight: 0.10
  
  hyperparameters:
    epochs: 1
    lr: 5e-7
    beta: 0.1      # DPO temperature
    warmup_ratio: 0.1
    lr_scheduler: cosine
    batch_size: 64
    max_length: 4096
```

### Stage 3: Safety Alignment
```yaml
safety_stage:
  method: "constitutional_ai + safety_dpo"
  datasets:
    - HH-RLHF (harmlessness subset)
    - BeaverTails
    - WildGuard
    - Do-Not-Answer
  
  process:
    1. Generate responses to safety-sensitive prompts
    2. Apply constitutional principles to rank responses
    3. Train DPO on safety preference pairs
    4. Test against XSTest for over-refusal calibration
```

### Stage 4: Iterative Reinforcement Learning
```yaml
rl_stage:
  method: "PPO or GRPO"
  reward_model:
    training_data:
      - UltraFeedback
      - Chatbot Arena data
      - Skywork Reward data
    architecture: same_as_policy_model (smaller variant)
  
  ppo_config:
    lr: 1e-6
    kl_penalty: 0.05
    clip_range: 0.2
    value_loss_coef: 0.1
    epochs_per_batch: 4
    batch_size: 512
    rollout_length: 1024
```
