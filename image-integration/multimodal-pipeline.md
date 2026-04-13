# INCLAW Multimodal Integration Pipeline

End-to-end pipeline for integrating image understanding into INCLAW's language model.

---

## 🔄 Pipeline Overview

```
                    ┌───────────────────────────────────┐
                    │     INCLAW Multimodal Pipeline      │
                    └───────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
            ┌─────────────┐ ┌──────────┐ ┌───────────────┐
            │ Text Input  │ │  Image   │ │ Multi-Image   │
            │             │ │  Input   │ │ Input         │
            └──────┬──────┘ └────┬─────┘ └──────┬────────┘
                   │             │              │
                   │      ┌──────┴─────┐       │
                   │      │ Dynamic    │       │
                   │      │ Tiling     │       │
                   │      └──────┬─────┘       │
                   │             │              │
                   │      ┌──────┴─────┐       │
                   │      │ Vision     │       │
                   │      │ Encoder    │◀──────┘
                   │      │ (ViT)      │
                   │      └──────┬─────┘
                   │             │
                   │      ┌──────┴─────┐
                   │      │ Pixel      │
                   │      │ Shuffle    │
                   │      └──────┬─────┘
                   │             │
                   │      ┌──────┴─────┐
                   │      │ Vision     │
                   │      │ Adapter    │
                   │      │ (MLP)      │
                   │      └──────┬─────┘
                   │             │
                   ▼             ▼
            ┌──────────────────────────┐
            │   Token Interleaving     │
            │   [TEXT] [IMG] [TEXT]     │
            └────────────┬─────────────┘
                         │
                         ▼
            ┌──────────────────────────┐
            │   LLM (Transformer)      │
            │   + Causal Attention     │
            └────────────┬─────────────┘
                         │
                         ▼
            ┌──────────────────────────┐
            │   Text Output            │
            │   (Autoregressive)       │
            └──────────────────────────┘
```

---

## 📥 Input Processing Pipeline

### Step 1: Input Parsing

```yaml
input_format:
  # Messages follow chat format with content blocks
  messages:
    - role: "user"
      content:
        - type: "text"
          text: "What does this chart show?"
        - type: "image"
          source:
            type: "base64"           # or "url"
            media_type: "image/png"
            data: "<base64_encoded>"
    - role: "assistant"
      content:
        - type: "text"
          text: "This chart shows..."
  
  # Supported image formats
  supported_formats: ["image/png", "image/jpeg", "image/gif", "image/webp", "image/bmp", "image/tiff"]
  max_image_size: 20_000_000  # 20MB
  max_images_per_request: 10
```

### Step 2: Image Preprocessing

```yaml
preprocessing:
  # 1. Decode image
  decode:
    - Validate format and integrity
    - Handle EXIF orientation
    - Convert to RGB (from RGBA, grayscale, etc.)
  
  # 2. Determine dynamic resolution
  dynamic_resolution:
    tile_size: 448
    max_tiles: 12
    method: "aspect_ratio_aware"
  
  # 3. Create tiles
  tiling:
    - Create thumbnail (resize to tile_size × tile_size)
    - Resize image to grid × tile_size
    - Split into individual tiles
    - Apply normalization (ImageNet mean/std)
  
  # 4. Normalize
  normalization:
    mean: [0.485, 0.456, 0.406]  # ImageNet
    std: [0.229, 0.224, 0.225]
```

### Step 3: Vision Encoding

```yaml
vision_encoding:
  encoder: "InternViT-6B-448px-V2.5"
  process:
    1. "Batch all tiles (thumbnail + grid tiles) together"
    2. "Forward pass through ViT → 1024 tokens per tile at dim 3200"
    3. "Apply pixel shuffle (2×2 merge) → 256 tokens per tile"
    4. "Forward through 2-layer MLP adapter → 256 tokens at LLM dim"
  
  output:
    tokens_per_tile: 256
    embedding_dim: 8192  # Matches LLM hidden size
```

### Step 4: Token Interleaving

```yaml
token_interleaving:
  # Visual tokens are inserted at the position of the <image> special token
  # in the text token sequence
  
  special_tokens:
    image_start: "<img>"       # Marks start of image tokens
    image_end: "</img>"        # Marks end of image tokens
    image_pad: "<img_pad>"     # Individual visual token placeholder
  
  example:
    text: "Describe this image: <img></img> in detail."
    tokenized: "[Describe] [this] [image] [:] [<img>] [v1] [v2] ... [v1792] [</img>] [in] [detail] [.]"
    # Where v1..v1792 are visual tokens from 1 thumbnail + 6 tiles
  
  multi_image:
    text: "Compare <img></img> with <img></img>"
    tokenized: "[Compare] [<img>] [v1_img1] ... [</img>] [with] [<img>] [v1_img2] ... [</img>]"
```

---

## 🔄 Training Pipeline Stages

### Stage 1: Vision-Language Pre-Alignment (Projector Warmup)

```yaml
stage_1_alignment:
  goal: "Align vision encoder features with LLM input space"
  
  data:
    - ShareGPT4V-PT: 1.2M image-text pairs
    - ALLaVA-Caption: 715K detailed captions
    - CC12M: 12M curated pairs (subset)
  
  training:
    trainable: [vision_adapter]
    frozen: [vision_encoder, llm]
    
    task: "Image captioning (predict caption given image)"
    loss: "Cross-entropy on caption tokens"
    
    hyperparameters:
      lr: 1e-3
      warmup_steps: 500
      scheduler: cosine
      epochs: 1
      batch_size: 256
      bf16: true
  
  compute: ~100 A100-GPU-hours
  validation: "Loss convergence on held-out captioning data"
```

### Stage 2: Multimodal Instruction Tuning

```yaml
stage_2_instruction_tuning:
  goal: "Full multimodal instruction following"
  
  data:
    primary:
      - LLaVA-OneVision-Data: 3.2M samples
      - Cambrian-7M: 7M samples (use subset)
    specialized:
      - DocVQA + Docmatix: Document understanding
      - ChartQA + InfoVQA: Chart/infographic understanding
      - MathVista + MMMU: Math/science visual reasoning
      - TextVQA: Text reading in images
      - AI2D: Diagram understanding
      - ShareGPT4V: High-quality visual QA
    
    text_only:
      # Include text-only instruction data to prevent forgetting
      - Tulu-3-SFT-Mix (subset): 200K samples
      - OpenHermes-2.5 (subset): 200K samples
    
    mix_ratio:
      multimodal: 70%
      text_only: 30%
  
  training:
    trainable: [vision_encoder, vision_adapter, llm]
    frozen: []
    
    hyperparameters:
      llm_lr: 2e-5
      vision_lr: 2e-6       # Lower LR for pre-trained vision
      adapter_lr: 2e-5
      warmup_ratio: 0.03
      scheduler: cosine
      epochs: 1
      batch_size: 128
      bf16: true
      gradient_checkpointing: true
      
      # Dynamic image handling
      max_visual_tokens: 3328   # 13 tiles × 256
      max_total_tokens: 8192
  
  compute: ~1000 A100-GPU-hours (for 70B model)
```

### Stage 3: Multimodal DPO/RLHF

```yaml
stage_3_alignment:
  goal: "Preference optimization for visual understanding quality"
  
  data:
    # Generate preference pairs by:
    # 1. Sampling multiple responses to visual questions
    # 2. Using GPT-4V or human annotators to rank
    # 3. Creating chosen/rejected pairs
    
    sources:
      - Synthetic visual preference data
      - Human-annotated visual QA preferences
      - Cross-model comparison data
    
    size: ~50K preference pairs
  
  method: DPO
  hyperparameters:
    lr: 5e-7
    beta: 0.1
    epochs: 1
    batch_size: 32
```

---

## 🧪 Quality Assurance & Validation

### Validation During Training

```yaml
validation_metrics:
  captioning:
    metric: CIDEr
    dataset: COCO Captions val
    target: >120
  
  vqa:
    metric: Accuracy
    dataset: VQAv2 val
    target: >80%
  
  document:
    metric: ANLS
    dataset: DocVQA val
    target: >90%
  
  chart:
    metric: Accuracy
    dataset: ChartQA test
    target: >85%
  
  general:
    metric: Accuracy
    dataset: MMBench test
    target: >83%
```

### Post-Training Evaluation

```yaml
evaluation_suite:
  benchmarks:
    - name: MMMU
      tool: VLMEvalKit
      split: val
      target: ≥70%
    
    - name: MathVista
      tool: VLMEvalKit
      split: testmini
      target: ≥70%
    
    - name: OCRBench
      tool: VLMEvalKit
      split: test
      target: ≥85%
    
    - name: DocVQA
      tool: VLMEvalKit
      split: test
      target: ≥93%
    
    - name: ChartQA
      tool: VLMEvalKit
      split: test
      target: ≥88%
    
    - name: RealWorldQA
      tool: VLMEvalKit
      split: test
      target: ≥72%
    
    - name: SEED-Bench
      tool: VLMEvalKit
      split: test
      target: ≥78%
  
  qualitative:
    - "Test OCR on diverse documents (English, Chinese, Japanese)"
    - "Test chart reading on complex multi-series charts"
    - "Test diagram understanding on UML/flowcharts"
    - "Test code screenshot reading"
    - "Test multi-image comparison"
    - "Test hallucination resistance (describe only what's visible)"
```

---

## ⚠️ Known Challenges & Solutions

### Challenge 1: Vision-Language Forgetting
**Problem**: Text-only performance degrades after multimodal training
**Solution**: 
- Include 30% text-only data during multimodal training
- Monitor text benchmarks (MMLU, etc.) throughout training
- Use separate learning rates for vision and language components

### Challenge 2: Hallucination in Visual QA
**Problem**: Model describes objects/text not present in the image
**Solution**:
- Include negative examples ("Is there a X in the image?" → "No")
- DPO training with hallucinating responses as rejected
- Grounding training (describe only what's visible)
- Explicit uncertainty prompting

### Challenge 3: OCR Quality on Complex Documents
**Problem**: Poor text extraction from low-quality scans, small text
**Solution**:
- Dynamic high-resolution tiling (up to 12 tiles)
- Include diverse document training data (Docmatix)
- OCR-specific fine-tuning stage
- Augment training with various font sizes, rotations, qualities

### Challenge 4: Chart/Diagram Numerical Accuracy
**Problem**: Imprecise reading of exact values from charts
**Solution**:
- Include charts with ground-truth data in training
- Train on synthetic charts (rendered with known values)
- Chain-of-thought for chart reasoning (read axes first, then values)
