# Image & Multimodal Training Datasets for INCLAW

Comprehensive catalog of open-source vision and multimodal datasets for training INCLAW's image understanding capabilities.

---

## 🖼️ Large-Scale Image-Text Pre-Training Datasets

### 1. LAION-5B
- **Size**: 5.85 billion image-text pairs
- **Description**: Largest open image-text dataset, filtered from CommonCrawl
- **License**: CC-BY 4.0 (metadata); images under original licenses
- **Source**: `huggingface.co/datasets/laion/laion5B-en`
- **Subsets**:
  - LAION-2B-en: 2.32B English pairs
  - LAION-2B-multi: 2.26B multilingual pairs
  - LAION-1B-nolang: 1.27B unidentified language
- **Quality Filters**: CLIP score, NSFW score, watermark probability
- **Relevance**: Primary vision-language pre-training data

### 2. DataComp-1B
- **Size**: 1.4B image-text pairs (filtered from 12.8B candidates)
- **Description**: Curated using CLIP-based filtering from CommonCrawl
- **License**: CC-BY 4.0
- **Source**: `huggingface.co/datasets/mlfoundations/datacomp_1b`
- **Relevance**: High-quality filtered subset, better signal-to-noise than raw LAION

### 3. COYO-700M (Kakao)
- **Size**: 747M image-text pairs
- **Description**: Korean & English image-text pairs from CommonCrawl
- **License**: CC-BY 4.0
- **Source**: `huggingface.co/datasets/kakaobrain/coyo-700m`
- **Relevance**: Additional pre-training data; multilingual vision coverage

### 4. CC12M (Conceptual 12M)
- **Size**: 12M image-text pairs
- **Description**: Curated from web with soft-quality filters
- **License**: Custom (research use)
- **Source**: `github.com/google-research-datasets/conceptual-12m`
- **Relevance**: High-quality curated subset for initial training

### 5. SA-1B (Segment Anything)
- **Size**: 11M images, 1.1B masks
- **Description**: Meta's segmentation dataset
- **License**: Apache 2.0
- **Source**: `ai.meta.com/datasets/segment-anything`
- **Relevance**: Dense visual understanding, pixel-level comprehension

---

## 📸 Visual Question Answering (VQA) Datasets

| Dataset | Size | Task | License | Source |
|---------|------|------|---------|--------|
| VQAv2 | 1.1M QA pairs, 204K images | Open-ended VQA | CC-BY 4.0 | `visualqa.org` |
| GQA | 22M questions, 113K images | Compositional VQA | CC-BY 4.0 | `cs.stanford.edu/people/doersch/gqa` |
| OK-VQA | 14K questions | Knowledge-requiring VQA | CC-BY 4.0 | `okvqa.allenai.org` |
| A-OKVQA | 25K questions | Augmented knowledge VQA | Apache 2.0 | HuggingFace |
| TextVQA | 45K questions, 28K images | Text reading in images | CC-BY 4.0 | `textvqa.org` |
| DocVQA | 50K QA pairs, 12K documents | Document understanding | CC-BY-NC 4.0 | HuggingFace |
| ChartQA | 32K QA pairs | Chart understanding | GPL 3.0 | HuggingFace |
| InfoVQA | 30K QA pairs | Infographic understanding | Research only | HuggingFace |
| ScienceQA | 21K multimodal MC questions | Scientific reasoning | CC-BY-NC-SA | HuggingFace |
| AI2D | 5K diagrams, 15K questions | Diagram understanding | CC-BY-SA | `allenai.org/data/diagrams` |

---

## 🔤 OCR & Document Understanding Datasets

| Dataset | Size | Task | License |
|---------|------|------|---------|
| IIT-CDIP | 11M scanned documents | Document classification | Research |
| RVL-CDIP | 400K document images | Document classification | Research |
| FUNSD | 199 forms | Form understanding | CC-BY 4.0 |
| CORD | 11K receipts | Receipt parsing | CC-BY 4.0 |
| SROIE | 1K receipts | Receipt OCR | Research |
| Docmatix | 2.4M images, 9.5M QA pairs | Document understanding | Apache 2.0 |
| The Cauldron | 50 vision-language datasets merged | Diverse multimodal | Various |

---

## 🎨 Image Captioning & Description Datasets

| Dataset | Size | Description | License |
|---------|------|-------------|---------|
| COCO Captions | 330K images, 1.5M captions | Natural image captions | CC-BY 4.0 |
| Visual Genome | 108K images, 5.4M descriptions | Dense region descriptions | CC-BY 4.0 |
| Flickr30K | 31K images, 158K captions | Descriptive captions | Research |
| ShareGPT4V | 100K high-quality captions | GPT-4V generated captions | Apache 2.0 |
| ALLaVA-Caption | 715K detailed captions | Detailed image descriptions | CC-BY 4.0 |
| DOCCI | 15K images | Detailed object-centric descriptions | CC-BY 4.0 |

---

## 🧩 Visual Reasoning & Understanding Datasets

| Dataset | Size | Task | License |
|---------|------|------|---------|
| MMMU | 11.5K questions, 30 subjects | College-level multimodal | CC-BY-NC-SA |
| MathVista | 6.1K questions | Mathematical visual reasoning | CC-BY-SA |
| SEED-Bench | 19K MC questions | Comprehensive VLM evaluation | Apache 2.0 |
| MMBench | 3K questions | Comprehensive VLM benchmark | Apache 2.0 |
| RealWorldQA | 700+ questions | Real-world spatial reasoning | Research |
| BLINK | 3.8K questions | Core visual perception tasks | CC-BY 4.0 |
| Cambrian | 7M curated multimodal samples | Comprehensive visual training | Apache 2.0 |

---

## 🎯 Visual Instruction Tuning Datasets

These are specifically designed for fine-tuning vision-language models:

| Dataset | Size | Method | License |
|---------|------|--------|---------|
| LLaVA-Instruct-150K | 150K instructions | GPT-4 generated from COCO | Apache 2.0 |
| LLaVA-Instruct-665K | 665K instructions | Extended instruction set | Apache 2.0 |
| ShareGPT4V-PT | 1.2M image-text pairs | GPT-4V detailed captions | Apache 2.0 |
| ShareGPT4V | 100K conversations | GPT-4V multi-turn vision QA | Apache 2.0 |
| ALLaVA-Instruct | 715K instructions | Laion + Vflan based | CC-BY 4.0 |
| Cauldron | 50 datasets merged | Comprehensive multimodal mix | Various |
| Cambrian-10M | 10M samples | Curated from diverse sources | Apache 2.0 |
| LLaVA-OneVision Data | 3.2M samples | Single/multi-image + video | Apache 2.0 |

---

## 📊 Recommended Dataset Usage for INCLAW

### Stage 1: Vision Encoder Pre-Training
```yaml
vision_pretraining:
  primary:
    - DataComp-1B        # 1.4B high-quality image-text pairs
    - COYO-700M          # Additional 700M pairs
  quality_filter:
    clip_score_threshold: 0.28
    nsfw_filter: true
    resolution_min: 224x224
```

### Stage 2: Vision-Language Alignment (Projector Training)
```yaml
alignment_stage:
  datasets:
    - ShareGPT4V-PT      # 1.2M detailed captions
    - ALLaVA-Caption      # 715K captions
    - CC12M               # 12M curated pairs
  training:
    freeze_vision: true
    freeze_llm: true
    train_projector: true
    epochs: 1
```

### Stage 3: Visual Instruction Tuning
```yaml
instruction_tuning:
  datasets:
    - LLaVA-OneVision-Data   # 3.2M diverse visual instructions
    - ShareGPT4V             # 100K high-quality conversations
    - Docmatix               # 2.4M document understanding
    - Cambrian-7M            # 7M comprehensive samples
  training:
    freeze_vision: false
    freeze_llm: false
    freeze_projector: false
    epochs: 1
    lr: 2e-5
```

### Stage 4: Specialized Visual Capabilities
```yaml
specialization:
  ocr_and_documents:
    - DocVQA
    - Docmatix
    - FUNSD
    - CORD
  charts_and_diagrams:
    - ChartQA
    - AI2D
    - InfoVQA
  math_and_science:
    - MathVista
    - ScienceQA
    - MMMU
  spatial_reasoning:
    - RealWorldQA
    - GQA
    - Visual Genome
```

---

## 📐 Image Resolution & Processing Guidelines

For competitive performance on visual benchmarks:

| Input Type | Recommended Resolution | Tiling Strategy |
|-----------|----------------------|----------------|
| Natural photos | 384×384 to 768×768 | Dynamic tiling (InternVL style) |
| Documents/PDFs | 1024×1024+ | High-res tiling with overlap |
| Charts/Diagrams | 768×768 | Preserve aspect ratio |
| Screenshots | Native resolution (up to 1920×1080) | Tile with context |
| Thumbnails | Upscale to 384×384 minimum | Bicubic interpolation |

### Dynamic Resolution Strategy (Recommended)
```
Input Image → Determine optimal grid (e.g., 2×3 tiles)
            → Resize to fit grid × tile_size (e.g., 448×448 per tile)
            → Also create a thumbnail (global view)
            → Concatenate: [thumbnail_tokens] + [tile_1_tokens] + ... + [tile_n_tokens]
            → Feed combined visual tokens to LLM
```
