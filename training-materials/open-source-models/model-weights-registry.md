# Open-Weight Model Registry for INCLAW

A curated registry of open-weight models available for distillation, fine-tuning, or architectural reference.

---

## 📦 How to Access Models

### Hugging Face Hub (Primary Source)
```bash
# Install transformers
pip install transformers accelerate

# Download model weights
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("model-id", torch_dtype="auto", device_map="auto")
tokenizer = AutoTokenizer.from_pretrained("model-id")
```

### Using `huggingface-cli`
```bash
pip install huggingface_hub
huggingface-cli download <model-id> --local-dir ./models/<model-name>
```

---

## 🗂️ Model Registry

### Foundation Models (Text-Only)

| Model | HF Model ID | Params | Quantized Available | Priority for INCLAW |
|-------|-------------|--------|-------------------|-------------------|
| LLaMA 3.1 8B | `meta-llama/Llama-3.1-8B` | 8B | GGUF, AWQ, GPTQ | ⭐⭐⭐ High |
| LLaMA 3.1 70B | `meta-llama/Llama-3.1-70B` | 70B | GGUF, AWQ, GPTQ | ⭐⭐⭐ High |
| LLaMA 3.1 405B | `meta-llama/Llama-3.1-405B` | 405B | GGUF, GPTQ | ⭐⭐⭐ High |
| LLaMA 3.3 70B | `meta-llama/Llama-3.3-70B-Instruct` | 70B | GGUF, AWQ | ⭐⭐⭐ High |
| Qwen 2.5 72B | `Qwen/Qwen2.5-72B` | 72B | GGUF, AWQ, GPTQ | ⭐⭐⭐ High |
| Qwen 2.5 32B | `Qwen/Qwen2.5-32B` | 32B | GGUF, AWQ | ⭐⭐ Medium |
| DeepSeek-V3 | `deepseek-ai/DeepSeek-V3` | 671B | FP8 | ⭐⭐⭐ High |
| DeepSeek-R1 | `deepseek-ai/DeepSeek-R1` | 671B | GGUF | ⭐⭐⭐ High |
| Mixtral 8x22B | `mistralai/Mixtral-8x22B-v0.1` | 141B | GGUF, AWQ | ⭐⭐ Medium |
| Mistral Nemo 12B | `mistralai/Mistral-Nemo-Instruct-2407` | 12B | GGUF, AWQ | ⭐⭐ Medium |
| Gemma 2 27B | `google/gemma-2-27b` | 27B | GGUF | ⭐⭐ Medium |
| Phi-4 | `microsoft/phi-4` | 14B | GGUF | ⭐⭐ Medium |
| Yi-1.5 34B | `01-ai/Yi-1.5-34B` | 34B | GGUF, AWQ | ⭐ Low |
| Command R+ | `CohereForAI/c4ai-command-r-plus` | 104B | GGUF | ⭐⭐ Medium |
| DBRX | `databricks/dbrx-instruct` | 132B | GPTQ | ⭐ Low |
| OLMo 2 | `allenai/OLMo-2-1124-13B` | 7B / 13B | GGUF | ⭐⭐ Medium |

### Instruct/Chat Variants

| Model | HF Model ID | Base Model | Alignment Method |
|-------|-------------|-----------|-----------------|
| LLaMA 3.1 70B Instruct | `meta-llama/Llama-3.1-70B-Instruct` | LLaMA 3.1 70B | SFT + DPO |
| Qwen 2.5 72B Instruct | `Qwen/Qwen2.5-72B-Instruct` | Qwen 2.5 72B | SFT + DPO |
| DeepSeek-V3-Chat | `deepseek-ai/DeepSeek-V3` | DeepSeek-V3 | SFT + RL |
| Mixtral 8x22B Instruct | `mistralai/Mixtral-8x22B-Instruct-v0.1` | Mixtral 8x22B | SFT + DPO |
| Tulu 3 70B | `allenai/Llama-3.1-Tulu-3-70B` | LLaMA 3.1 70B | SFT + DPO + RL |
| Hermes 3 70B | `NousResearch/Hermes-3-Llama-3.1-70B` | LLaMA 3.1 70B | SFT |
| OpenChat 3.6 | `openchat/openchat-3.6-8b-20240522` | LLaMA 3 8B | C-RLFT |

### Vision-Language Models

| Model | HF Model ID | Vision Encoder | LLM Backbone | Priority |
|-------|-------------|---------------|-------------|----------|
| InternVL 2.5 78B | `OpenGVLab/InternVL2_5-78B` | InternViT-6B | Qwen 2.5 72B | ⭐⭐⭐ High |
| InternVL 2.5 26B | `OpenGVLab/InternVL2_5-26B` | InternViT-6B | InternLM2 20B | ⭐⭐⭐ High |
| LLaVA-OneVision 72B | `lmms-lab/llava-onevision-qwen2-72b-ov` | SigLIP | Qwen 2 72B | ⭐⭐⭐ High |
| LLaVA-NeXT 34B | `lmms-lab/llava-next-interleave-qwen-7b` | CLIP ViT-L | Qwen 1.5 | ⭐⭐ Medium |
| Qwen2-VL 72B | `Qwen/Qwen2-VL-72B-Instruct` | Qwen ViT | Qwen 2 72B | ⭐⭐⭐ High |
| Idefics3 8B | `HuggingFaceM4/Idefics3-8B-Llama3` | SigLIP | LLaMA 3 8B | ⭐⭐ Medium |
| Molmo 72B | `allenai/Molmo-72B-0924` | CLIP ViT-L | Qwen 2 72B | ⭐⭐ Medium |
| PaliGemma 2 | `google/paligemma2-10b-ft-docci-448` | SigLIP | Gemma 2 | ⭐⭐ Medium |

### Code-Specialized Models

| Model | HF Model ID | Languages | Priority |
|-------|-------------|-----------|----------|
| Qwen 2.5 Coder 32B | `Qwen/Qwen2.5-Coder-32B-Instruct` | 90+ | ⭐⭐⭐ High |
| DeepSeek Coder V2 236B | `deepseek-ai/DeepSeek-Coder-V2-Instruct` | 300+ | ⭐⭐⭐ High |
| StarCoder 2 15B | `bigcode/starcoder2-15b` | 600+ | ⭐⭐ Medium |
| CodeLlama 70B | `meta-llama/CodeLlama-70b-Instruct-hf` | 20+ | ⭐⭐ Medium |
| CodeGemma 7B | `google/codegemma-7b-it` | 20+ | ⭐ Low |

### Reasoning-Specialized Models

| Model | HF Model ID | Technique | Priority |
|-------|-------------|-----------|----------|
| DeepSeek-R1 | `deepseek-ai/DeepSeek-R1` | Chain-of-Thought RL | ⭐⭐⭐ High |
| DeepSeek-R1-Distill 70B | `deepseek-ai/DeepSeek-R1-Distill-Llama-70B` | Distilled reasoning | ⭐⭐⭐ High |
| Qwen-QwQ 32B | `Qwen/QwQ-32B` | Reasoning via search | ⭐⭐⭐ High |
| s1-32B | `simplescaling/s1-32B` | Budget forcing CoT | ⭐⭐ Medium |

---

## 💾 Storage Requirements

| Model Size | FP16 Storage | FP8 Storage | INT4 (GPTQ/AWQ) | GGUF Q4_K_M |
|-----------|-------------|-------------|-----------------|-------------|
| 7B | ~14 GB | ~7 GB | ~4 GB | ~4.5 GB |
| 13B | ~26 GB | ~13 GB | ~7.5 GB | ~8 GB |
| 34B | ~68 GB | ~34 GB | ~20 GB | ~21 GB |
| 70B | ~140 GB | ~70 GB | ~40 GB | ~42 GB |
| 405B | ~810 GB | ~405 GB | ~230 GB | ~240 GB |
| 671B (MoE) | ~1.3 TB | ~671 GB | ~380 GB | ~400 GB |

---

## 🔄 Recommended Download Priority for INCLAW

### Phase 1 (Core — Start Here)
1. `meta-llama/Llama-3.1-70B` — Primary base model
2. `Qwen/Qwen2.5-72B` — Secondary base / comparison
3. `OpenGVLab/InternVL2_5-78B` — Vision-language reference
4. `deepseek-ai/DeepSeek-R1-Distill-Llama-70B` — Reasoning reference

### Phase 2 (Specialization)
5. `Qwen/Qwen2.5-Coder-32B-Instruct` — Code specialization
6. `CohereForAI/c4ai-command-r-plus` — RAG/tool-use reference
7. `allenai/Llama-3.1-Tulu-3-70B` — Alignment reference

### Phase 3 (Architecture Study)
8. `deepseek-ai/DeepSeek-V3` — MoE architecture study
9. `mistralai/Mixtral-8x22B-v0.1` — Alternative MoE reference
10. `microsoft/phi-4` — Data quality methodology
