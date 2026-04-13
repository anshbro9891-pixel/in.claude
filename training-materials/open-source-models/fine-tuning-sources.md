# Fine-Tuning Sources & Techniques for INCLAW

This document catalogs open-source fine-tuning datasets, techniques, and methodologies.

---

## 🎯 Fine-Tuning Strategies

### 1. Supervised Fine-Tuning (SFT)
The primary method for turning a base model into an instruction-following assistant.

**Process**:
```
Base Model → SFT on instruction data → Instruction-following model
```

**Key Datasets for SFT**:

| Dataset | Size | Description | License | Source |
|---------|------|-------------|---------|--------|
| OpenAssistant Conversations (OASST2) | 65K conversations | Multi-turn human-written conversations with quality ratings | Apache 2.0 | huggingface.co/datasets/OpenAssistant/oasst2 |
| ShareGPT / ShareGPT-Vicuna | 70K+ conversations | Real user conversations with ChatGPT | CC-BY-NC | huggingface.co/datasets/anon8231489123/ShareGPT_Vicuna_unfiltered |
| Dolly 15K | 15K instructions | Databricks employee-written instruction pairs | CC-BY-SA 3.0 | huggingface.co/datasets/databricks/databricks-dolly-15k |
| OpenHermes 2.5 | 1M+ instructions | Curated synthetic instruction data | Apache 2.0 | huggingface.co/datasets/teknium/OpenHermes-2.5 |
| SlimOrca | 518K instructions | Cleaned & deduplicated FLAN/Orca data | MIT | huggingface.co/datasets/Open-Orca/SlimOrca |
| Capybara | 16K multi-turn | Multi-turn conversation dataset | Apache 2.0 | huggingface.co/datasets/LDJnr/Capybara |
| UltraChat 200K | 200K conversations | Cleaned version of UltraChat | MIT | huggingface.co/datasets/HuggingFaceH4/ultrachat_200k |
| Magpie-Pro-300K | 300K instructions | Synthetic high-quality instructions | Apache 2.0 | huggingface.co/datasets/Magpie-Align/Magpie-Pro-300K-Filtered |
| WildChat | 1M conversations | Real user–GPT conversations | AI2 ImpACT | huggingface.co/datasets/allenai/WildChat-1M |
| Tulu 3 SFT Mix | ~1M instructions | Curated mix from AI2 for Tulu 3 | ODC-BY | huggingface.co/datasets/allenai/tulu-3-sft-mixture |

### 2. Reinforcement Learning from Human Feedback (RLHF)

**Process**:
```
SFT Model → Train Reward Model → PPO/DPO optimization → Aligned model
```

**Key Preference/Reward Datasets**:

| Dataset | Size | Description | License | Source |
|---------|------|-------------|---------|--------|
| UltraFeedback | 64K prompts, 256K responses | GPT-4 rated responses across multiple models | MIT | huggingface.co/datasets/openbmb/UltraFeedback |
| HH-RLHF (Anthropic) | 170K comparisons | Human harmlessness and helpfulness preferences | MIT | huggingface.co/datasets/Anthropic/hh-rlhf |
| Nectar | 182K conversations | 7-wise comparison data ranked by GPT-4 | CC-BY-NC | huggingface.co/datasets/berkeley-nest/Nectar |
| Chatbot Arena Conversations | 100K+ battles | Real human preference votes from LMSYS Arena | CC-BY | huggingface.co/datasets/lmsys/chatbot_arena_conversations |
| Argilla DPO Mix | 420K pairs | Curated preference pairs from multiple sources | Apache 2.0 | huggingface.co/datasets/argilla/dpo-mix-7k |
| Skywork Reward Data | 80K pairs | High-quality preference pairs for reward modeling | Apache 2.0 | huggingface.co/datasets/Skywork/Skywork-Reward-Preference-80K-v0.2 |
| Tulu 3 Preference Mix | ~500K | Preference data used for Tulu 3 DPO | ODC-BY | huggingface.co/datasets/allenai/tulu-3-pref-mixture |

### 3. Direct Preference Optimization (DPO)
A simpler alternative to RLHF that doesn't require a separate reward model.

**Key Advantage**: Directly optimizes the policy model using preference pairs — no reward model needed.

**Process**:
```
SFT Model → DPO training on preference pairs → Aligned model
```

### 4. Reinforcement Learning from AI Feedback (RLAIF) / Constitutional AI
Uses AI-generated preferences instead of (or alongside) human preferences.

**Process**:
```
SFT Model → AI generates critiques → AI ranks responses → Train on AI preferences
```

**Key Resources**:
- Anthropic Constitutional AI paper & principles
- Self-play preference optimization (SPIN)
- Kahneman-Tversky Optimization (KTO) — only needs binary good/bad labels

---

## 🛠️ Fine-Tuning Techniques

### Parameter-Efficient Fine-Tuning (PEFT)

| Technique | Description | Memory Savings | Quality |
|-----------|-------------|---------------|---------|
| **LoRA** | Low-Rank Adaptation — adds trainable low-rank matrices | ~90% reduction | Near full fine-tune |
| **QLoRA** | Quantized LoRA — 4-bit base model + LoRA | ~95% reduction | Slightly below LoRA |
| **DoRA** | Weight-Decomposed LoRA — decomposes magnitude & direction | ~90% reduction | Above LoRA |
| **Adapter Layers** | Insert small trainable layers between frozen layers | ~85% reduction | Good |
| **Prefix Tuning** | Prepend trainable tokens to each layer | ~95% reduction | Moderate |
| **IA3** | Rescales activations with learned vectors | ~99% reduction | Moderate |

### Recommended PEFT Configuration for INCLAW

```yaml
# LoRA Configuration (Recommended for INCLAW fine-tuning)
lora:
  r: 64                    # Rank (higher = more capacity)
  alpha: 128               # Scaling factor (typically 2x rank)
  target_modules:
    - q_proj
    - k_proj
    - v_proj
    - o_proj
    - gate_proj
    - up_proj
    - down_proj
  dropout: 0.05
  bias: "none"
  task_type: "CAUSAL_LM"
```

---

## 🔄 Multi-Stage Fine-Tuning Pipeline for INCLAW

### Stage 1: General Instruction Following
- **Data**: OpenHermes 2.5 + UltraChat 200K + Tulu 3 SFT Mix
- **Epochs**: 2-3
- **Learning Rate**: 2e-5 with cosine decay
- **Goal**: Basic instruction following, conversation, helpfulness

### Stage 2: Specialized Capabilities
- **Code**: Train on code-specific data (see code-datasets.md)
- **Math**: Train on math reasoning chains
- **Tool Use**: Train on function-calling datasets
- **Vision**: Multimodal fine-tuning (see image-integration/)
- **Learning Rate**: 1e-5

### Stage 3: Alignment (DPO/RLHF)
- **Data**: UltraFeedback + HH-RLHF + Tulu 3 Preference Mix
- **Method**: DPO (simpler) or PPO (more powerful)
- **Learning Rate**: 5e-7
- **Goal**: Safety, helpfulness, reduced hallucination

### Stage 4: Agentic Capabilities
- **Data**: Agent trajectories, tool-use traces, multi-step reasoning
- **Method**: SFT on successful trajectories + RL on task completion
- **Goal**: Autonomous task execution, error recovery, planning

---

## 📚 Key Papers & References

1. **RLHF**: "Training language models to follow instructions with human feedback" (Ouyang et al., 2022)
2. **DPO**: "Direct Preference Optimization" (Rafailov et al., 2023)
3. **Constitutional AI**: "Constitutional AI: Harmlessness from AI Feedback" (Bai et al., 2022)
4. **LoRA**: "LoRA: Low-Rank Adaptation of Large Language Models" (Hu et al., 2021)
5. **QLoRA**: "QLoRA: Efficient Finetuning of Quantized LLMs" (Dettmers et al., 2023)
6. **Tulu 3**: "Tulu 3: Pushing Frontiers in Open Language Model Post-Training" (AI2, 2024)
7. **SPIN**: "Self-Play Fine-Tuning Converts Weak LMs to Strong LMs" (Chen et al., 2024)
8. **KTO**: "KTO: Model Alignment as Prospect Theoretic Optimization" (Ethayarajh et al., 2024)
