# Open-Source Foundation Models for INCLAW Training

This document catalogs all major open-source foundation models that INCLAW can learn from, distill knowledge from, or use as reference architectures.

---

## 🏗️ Tier 1: Large Foundation Models (70B+ Parameters)

### 1. LLaMA 3.1 (Meta)
- **Parameters**: 8B / 70B / 405B
- **Architecture**: Dense Transformer with GQA (Grouped Query Attention)
- **Context Window**: 128K tokens
- **License**: Llama 3.1 Community License
- **Source**: https://github.com/meta-llama/llama3
- **Key Features**:
  - Multilingual support (8 languages)
  - Strong code generation capabilities
  - Tool use and function calling
- **Training Data**: 15T+ tokens of publicly available data
- **Relevance to INCLAW**: Core architecture reference for dense transformer design; fine-tuning base

### 2. Mixtral 8x22B (Mistral AI)
- **Parameters**: 141B total (39B active via MoE)
- **Architecture**: Mixture of Experts (MoE) Sparse Transformer
- **Context Window**: 64K tokens
- **License**: Apache 2.0
- **Source**: https://huggingface.co/mistralai/Mixtral-8x22B-v0.1
- **Key Features**:
  - Efficient MoE routing — only activates subset of parameters per token
  - Strong math and reasoning
  - Native function calling
- **Relevance to INCLAW**: MoE architecture reference for efficient scaling

### 3. DeepSeek-V3 (DeepSeek AI)
- **Parameters**: 671B total (37B active via MoE)
- **Architecture**: MoE with Multi-head Latent Attention (MLA)
- **Context Window**: 128K tokens
- **License**: MIT-like permissive
- **Source**: https://github.com/deepseek-ai/DeepSeek-V3
- **Key Features**:
  - Auxiliary-loss-free load balancing for MoE
  - Multi-Token Prediction (MTP) training objective
  - FP8 mixed precision training
- **Training Data**: 14.8T tokens
- **Relevance to INCLAW**: State-of-the-art efficient training techniques; MLA attention mechanism

### 4. Qwen 2.5 (Alibaba)
- **Parameters**: 0.5B / 3B / 7B / 14B / 32B / 72B
- **Architecture**: Dense Transformer with GQA
- **Context Window**: 128K tokens
- **License**: Apache 2.0 (most sizes)
- **Source**: https://github.com/QwenLM/Qwen2.5
- **Key Features**:
  - Strong multilingual performance (29+ languages)
  - Excellent coding capabilities (Qwen2.5-Coder)
  - Math specialization (Qwen2.5-Math)
- **Relevance to INCLAW**: Reference for building specialized variants; strong multilingual training data

### 5. Falcon 180B (TII)
- **Parameters**: 180B
- **Architecture**: Dense Transformer with multi-query attention
- **Context Window**: 2K tokens (base)
- **License**: Falcon-180B TII License
- **Source**: https://huggingface.co/tiiuae/falcon-180B
- **Relevance to INCLAW**: Data curation methodology (RefinedWeb)

---

## 🏗️ Tier 2: Mid-Size Models (7B–70B Parameters)

### 6. Mistral 7B / Mistral Nemo 12B
- **Parameters**: 7B / 12B
- **Architecture**: Dense Transformer with Sliding Window Attention + GQA
- **Context Window**: 32K (7B) / 128K (Nemo)
- **License**: Apache 2.0
- **Source**: https://github.com/mistralai/mistral-src
- **Key Features**:
  - Sliding window attention for efficient long-context
  - Exceptional performance-to-size ratio
- **Relevance to INCLAW**: Efficient attention mechanisms; distillation target

### 7. Gemma 2 (Google)
- **Parameters**: 2B / 9B / 27B
- **Architecture**: Dense Transformer with local + global attention
- **Context Window**: 8K tokens
- **License**: Gemma Terms of Use (permissive)
- **Source**: https://github.com/google-deepmind/gemma
- **Key Features**:
  - Knowledge distillation from larger Gemini models
  - Alternating local/global attention layers
  - Logit soft-capping
- **Relevance to INCLAW**: Knowledge distillation techniques from proprietary models

### 8. Phi-4 (Microsoft)
- **Parameters**: 14B
- **Architecture**: Dense Transformer
- **Context Window**: 16K tokens
- **License**: MIT
- **Source**: https://huggingface.co/microsoft/phi-4
- **Key Features**:
  - Trained on high-quality synthetic data
  - Strong reasoning despite small size
  - Focus on data quality over quantity
- **Relevance to INCLAW**: Synthetic data generation methodology; data quality filtering

### 9. Yi-1.5 (01.AI)
- **Parameters**: 6B / 9B / 34B
- **Architecture**: Dense Transformer
- **Context Window**: 200K tokens
- **License**: Apache 2.0
- **Source**: https://github.com/01-ai/Yi
- **Relevance to INCLAW**: Long-context training techniques

### 10. Command R+ (Cohere)
- **Parameters**: 104B
- **Architecture**: Dense Transformer with tool-use specialization
- **Context Window**: 128K tokens
- **License**: CC-BY-NC (non-commercial)
- **Source**: https://huggingface.co/CohereForAI/c4ai-command-r-plus
- **Key Features**:
  - Retrieval Augmented Generation (RAG) optimized
  - Grounded generation with citations
  - Native multi-step tool use
- **Relevance to INCLAW**: RAG and tool-use training methodologies

---

## 🏗️ Tier 3: Specialized Models

### 11. CodeLlama / StarCoder 2 (Code)
- **StarCoder 2**: 3B / 7B / 15B — trained on The Stack v2 (600+ languages)
- **CodeLlama**: 7B / 13B / 34B / 70B — fine-tuned from LLaMA for code
- **Source**: https://github.com/bigcode-project/starcoder2
- **Relevance to INCLAW**: Code-specific training data curation and fill-in-the-middle (FIM) training

### 12. InternVL 2.5 (Vision-Language)
- **Parameters**: Up to 78B
- **Architecture**: Vision Transformer + LLM bridge
- **Source**: https://github.com/OpenGVLab/InternVL
- **Key Features**:
  - Dynamic resolution support
  - Strong OCR and document understanding
  - Chart and diagram interpretation
- **Relevance to INCLAW**: Vision-language architecture reference (critical for image integration)

### 13. LLaVA-NeXT / LLaVA-OneVision (Vision-Language)
- **Architecture**: CLIP ViT + LLM with projection layer
- **Source**: https://github.com/LLaVA-VL/LLaVA-NeXT
- **Key Features**:
  - Simple but effective vision-language connector
  - Strong visual reasoning
  - Video understanding
- **Relevance to INCLAW**: Multimodal connector design; visual instruction tuning data

### 14. Whisper (Audio — OpenAI)
- **Parameters**: Up to 1.5B
- **Architecture**: Encoder-Decoder Transformer
- **License**: MIT
- **Source**: https://github.com/openai/whisper
- **Relevance to INCLAW**: Future audio modality integration

### 15. DBRX (Databricks)
- **Parameters**: 132B total (36B active, MoE)
- **Architecture**: Fine-grained MoE (16 experts, 4 active)
- **License**: Databricks Open Model License
- **Source**: https://github.com/databricks/dbrx
- **Relevance to INCLAW**: Fine-grained MoE routing strategies

---

## 📋 Model Comparison Matrix

| Model | Params | Architecture | Context | License | Code | Vision | Tool Use |
|-------|--------|-------------|---------|---------|------|--------|----------|
| LLaMA 3.1 405B | 405B | Dense | 128K | Community | ✅ | ❌ | ✅ |
| Mixtral 8x22B | 141B (39B) | MoE | 64K | Apache 2.0 | ✅ | ❌ | ✅ |
| DeepSeek-V3 | 671B (37B) | MoE+MLA | 128K | MIT-like | ✅ | ❌ | ✅ |
| Qwen 2.5-72B | 72B | Dense | 128K | Apache 2.0 | ✅ | ❌ | ✅ |
| InternVL 2.5 | 78B | ViT+LLM | 32K | Apache 2.0 | ❌ | ✅ | ❌ |
| LLaVA-OneVision | 72B | CLIP+LLM | 32K | Apache 2.0 | ❌ | ✅ | ❌ |
| Phi-4 | 14B | Dense | 16K | MIT | ✅ | ❌ | ✅ |
| StarCoder 2 | 15B | Dense | 16K | BigCode ORL | ✅ | ❌ | ❌ |

---

## 🔑 Key Architectural Insights for INCLAW

### From LLaMA 3.1:
- Grouped Query Attention (GQA) for efficient inference
- RoPE positional embeddings with scaling for long context
- SwiGLU activation function
- Pre-normalization with RMSNorm

### From DeepSeek-V3:
- Multi-head Latent Attention (MLA) — compresses KV cache by 93%
- Multi-Token Prediction for faster training convergence
- Auxiliary-loss-free MoE balancing

### From Mixtral:
- Sparse Mixture of Experts for compute-efficient scaling
- Expert routing with top-k selection

### From Phi-4:
- Synthetic data generation pipelines
- Curriculum learning with data quality filtering
- "Textbook quality" data curation

### From InternVL 2.5:
- Dynamic resolution for image inputs
- Progressive vision-language training (pretrain → finetune)
- Pixel shuffle for efficient vision token compression

---

## 📥 How to Use This Catalog

1. **Architecture Design**: Pick the best architectural components from each model
2. **Pre-training**: Use open-weight models as initialization or for knowledge distillation
3. **Data Curation**: Follow the data pipelines described by each project
4. **Fine-tuning**: Use open-weight models as base for domain-specific fine-tuning
5. **Benchmarking**: Compare INCLAW against these models on standard benchmarks
