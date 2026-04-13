# INCLAW Vision Architecture — Image Integration & Interpretation

This document defines the architecture for INCLAW's image understanding capabilities, enabling it to interpret, analyze, and reason about visual content at a level competitive with Claude Opus 4.6 and GPT-5.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        INCLAW Vision Architecture                    │
│                                                                      │
│  ┌──────────┐    ┌──────────────┐    ┌─────────┐    ┌────────────┐ │
│  │  Image    │    │   Vision     │    │ Vision  │    │   Large    │ │
│  │  Input    │───▶│  Encoder     │───▶│ Adapter │───▶│  Language  │ │
│  │          │    │  (ViT)       │    │ (MLP)   │    │   Model    │ │
│  └──────────┘    └──────────────┘    └─────────┘    └────────────┘ │
│       │                                                    │        │
│       ▼                                                    ▼        │
│  ┌──────────┐                                      ┌────────────┐  │
│  │ Dynamic  │                                      │  Text      │  │
│  │ Tiling   │                                      │  Output    │  │
│  │ Engine   │                                      │            │  │
│  └──────────┘                                      └────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. Vision Encoder

### Recommended: InternViT-6B (from InternVL)

**Why InternViT-6B**:
- 6 billion parameters — largest open-source vision encoder
- Trained on large-scale image-text data with contrastive learning
- Strong performance on fine-grained visual tasks
- Open-source with Apache 2.0 license

**Architecture Details**:
```yaml
vision_encoder:
  name: "InternViT-6B-448px-V2.5"
  type: "Vision Transformer (ViT)"
  parameters: 6B
  input_resolution: 448 × 448 (per tile)
  patch_size: 14 × 14
  hidden_size: 3200
  num_layers: 48
  num_heads: 25
  intermediate_size: 12800
  output_tokens_per_tile: 1024  # (448/14)² = 1024
  
  # After pixel shuffle (2×2 merge): 256 tokens per tile
  pixel_shuffle:
    enabled: true
    scale_factor: 2
    output_tokens_per_tile: 256
```

### Alternative: SigLIP-SO400M (from Google)

For a lighter-weight option:
```yaml
alternative_vision_encoder:
  name: "SigLIP-SO400M-384"
  parameters: 400M
  input_resolution: 384 × 384
  patch_size: 14 × 14
  output_tokens_per_tile: 729  # (384/14)² ≈ 729
  advantages:
    - Sigmoid loss (better for batch training)
    - Lighter weight (400M vs 6B)
    - Strong baseline performance
  disadvantages:
    - Less capacity for fine-grained understanding
    - Weaker on OCR and document tasks
```

---

## 2. Dynamic Resolution & Tiling

### Dynamic Tiling Strategy (Critical for Document/Chart Understanding)

```
Input Image (any resolution)
       │
       ▼
┌─────────────────────┐
│  Determine Optimal  │
│  Grid Configuration │
│  (aspect-aware)     │
└─────────────────────┘
       │
       ├──▶ Thumbnail (global view): Resize to 448×448
       │
       └──▶ Tiles (detail views): Split into N tiles of 448×448
            │
            ▼
       ┌─────────────────────────────────┐
       │ Supported Grid Configurations:   │
       │  1×1, 1×2, 2×1, 1×3, 3×1,     │
       │  2×2, 1×4, 4×1, 2×3, 3×2,     │
       │  1×5, 5×1, 2×4, 4×2, 3×3,     │
       │  1×6, 6×1 ... up to max_tiles   │
       └─────────────────────────────────┘
```

### Configuration
```yaml
dynamic_tiling:
  tile_size: 448
  max_tiles: 12           # Maximum tiles per image
  min_tiles: 1            # Minimum (just thumbnail)
  include_thumbnail: true  # Always include global view
  
  # Grid selection algorithm
  grid_selection:
    method: "aspect_ratio_aware"
    # For each candidate grid (rows × cols):
    #   1. Compute target resolution = grid × tile_size
    #   2. Resize image to fit within target (preserving aspect ratio)
    #   3. Compute effective resolution = actual pixels used
    #   4. Select grid that maximizes effective resolution
    #   5. Subject to max_tiles constraint
  
  # Token budget per image
  tokens_per_tile: 256     # After pixel shuffle
  thumbnail_tokens: 256
  # Total tokens per image = 256 + (num_tiles × 256)
  # Max tokens per image = 256 + (12 × 256) = 3,328
```

### Example Resolutions
```
Photo (4:3, 1200×900):
  → Grid: 3×2 = 6 tiles
  → Resize to: 1344×896
  → Tokens: 256 (thumb) + 6×256 = 1,792 tokens

Document (Letter, 2550×3300):
  → Grid: 2×3 = 6 tiles (or higher for OCR)
  → Resize to: 896×1344
  → Tokens: 256 (thumb) + 6×256 = 1,792 tokens

Panorama (16:9, 1920×1080):
  → Grid: 4×2 = 8 tiles
  → Resize to: 1792×896
  → Tokens: 256 (thumb) + 8×256 = 2,304 tokens
```

---

## 3. Vision-Language Adapter (Projector)

The adapter bridges the vision encoder output space to the LLM input space.

### Recommended: 2-Layer MLP with GELU

```yaml
vision_adapter:
  type: "mlp"
  layers:
    - input_dim: 3200       # InternViT hidden size
      output_dim: 8192      # LLM hidden size (for 70B-class model)
      activation: "gelu"
    - input_dim: 8192
      output_dim: 8192      # Match LLM hidden size
      activation: null       # Linear output
  
  # Alternative: Perceiver Resampler (reduces token count further)
  # perceiver:
  #   num_latent_tokens: 64   # Fixed-size output
  #   cross_attention_layers: 6
  #   advantage: "Fixed token count regardless of image resolution"
  #   disadvantage: "May lose fine-grained detail"
```

### Token Flow
```
Vision Encoder (InternViT-6B)
    │
    │  Output: 1024 tokens per tile (before pixel shuffle)
    ▼
Pixel Shuffle (2×2 merge)
    │
    │  Output: 256 tokens per tile
    ▼
Vision Adapter (2-layer MLP)
    │
    │  Output: 256 tokens per tile (projected to LLM dimension)
    ▼
Concatenate with text tokens → Feed to LLM

Example: 1 thumbnail + 6 tiles = 1,792 visual tokens
         + text prompt tokens → Total input to LLM
```

---

## 4. Image Interpretation Capabilities

### 4.1 General Visual Understanding
```yaml
capabilities:
  scene_understanding:
    - Object recognition and classification
    - Scene description and captioning
    - Spatial relationship understanding
    - Activity/action recognition
    - Emotional/aesthetic interpretation
  
  fine_grained:
    - Face detection (not identification — privacy)
    - Landmark recognition
    - Food identification
    - Animal/plant species classification
    - Art style identification
```

### 4.2 Document & Text Understanding (OCR)
```yaml
  document_understanding:
    - Printed text OCR (multi-language)
    - Handwritten text recognition
    - Table extraction and parsing
    - Form field understanding
    - Receipt/invoice parsing
    - PDF page understanding
    - LaTeX/mathematical notation reading
    
  training_data:
    - DocVQA, Docmatix, FUNSD, CORD, SROIE
    - Rendered LaTeX equations
    - Synthetic documents with known ground truth
```

### 4.3 Chart & Diagram Interpretation
```yaml
  chart_understanding:
    - Bar charts (grouped, stacked)
    - Line graphs (multi-series)
    - Pie charts
    - Scatter plots
    - Heatmaps
    - Box plots
    - Area charts
    - Treemaps
    
  diagram_understanding:
    - Flowcharts
    - UML diagrams (class, sequence, activity)
    - Architecture diagrams
    - Circuit diagrams
    - Mind maps
    - Org charts
    
  training_data:
    - ChartQA, AI2D, InfoVQA
    - Synthetic charts with known data
    - Rendered PlotlyPlot/Matplotlib charts
```

### 4.4 Mathematical Visual Reasoning
```yaml
  math_vision:
    - Geometry problem solving (from figures)
    - Graph/function interpretation
    - Statistical chart analysis
    - Proof diagram understanding
    - Word problem with visual context
    
  training_data:
    - MathVista, MMMU (STEM subjects)
    - Synthetic math figures
    - Textbook diagram datasets
```

### 4.5 Code & Screenshot Understanding
```yaml
  code_vision:
    - Code screenshot → text conversion
    - UI screenshot understanding
    - Error message screenshot reading
    - Terminal/console output interpretation
    - Webpage screenshot analysis
    
  training_data:
    - Synthetic code screenshots (rendered from code datasets)
    - Web UI datasets (WebSight, ScreenSpot)
    - IDE screenshot data
```

### 4.6 Multi-Image Understanding
```yaml
  multi_image:
    - Image comparison (find differences)
    - Image sequence understanding (before/after)
    - Multi-view 3D understanding
    - Document page sequences
    - Slide deck understanding
    
  implementation:
    # Each image processed independently through vision encoder
    # All visual tokens concatenated in sequence
    # LLM attends to all images jointly
    max_images_per_context: 10
    total_max_visual_tokens: 8192
```

---

## 5. Training Pipeline for Vision

### Phase 1: Vision Encoder Selection/Training
```yaml
phase_1_vision_encoder:
  option_a: "Use pre-trained InternViT-6B (recommended)"
  option_b: "Train from scratch with CLIP/SigLIP objective"
  
  if_training_from_scratch:
    data: DataComp-1B + COYO-700M
    objective: "SigLIP (sigmoid contrastive loss)"
    batch_size: 32768
    lr: 1e-3
    epochs: 32
    compute: "~2000 GPU-hours (A100)"
```

### Phase 2: Vision-Language Alignment
```yaml
phase_2_alignment:
  description: "Train only the projector; freeze vision encoder and LLM"
  data:
    - ShareGPT4V-PT (1.2M)
    - ALLaVA-Caption (715K)
  
  frozen: [vision_encoder, llm]
  trainable: [vision_adapter]
  
  hyperparameters:
    lr: 1e-3
    epochs: 1
    batch_size: 256
    warmup_steps: 500
    scheduler: cosine
  
  compute: "~100 GPU-hours (A100)"
```

### Phase 3: Visual Instruction Tuning
```yaml
phase_3_instruction_tuning:
  description: "Unfreeze all components; train end-to-end"
  data:
    - LLaVA-OneVision-Data (3.2M)
    - ShareGPT4V (100K)
    - Docmatix (2.4M)
    - ChartQA + AI2D + DocVQA + MathVista (specialized)
  
  frozen: []  # Everything trainable
  trainable: [vision_encoder, vision_adapter, llm]
  
  hyperparameters:
    lr: 2e-5  # Lower LR for end-to-end
    vision_lr: 2e-6  # Even lower for vision encoder
    epochs: 1
    batch_size: 128
    max_visual_tokens: 3328
    max_total_tokens: 8192
  
  compute: "~1000 GPU-hours (A100) for 70B model"
```

### Phase 4: Vision-Specific DPO
```yaml
phase_4_vision_dpo:
  description: "Preference optimization for vision tasks"
  data:
    - Vision preference data (human ratings on visual QA)
    - Synthetic preferences from multiple VLM outputs
  
  method: DPO
  hyperparameters:
    lr: 5e-7
    beta: 0.1
    epochs: 1
```

---

## 6. Vision Benchmarks & Targets

| Benchmark | Task | INCLAW Target | Claude Opus 4.6 | GPT-5 | Gemini 2.5 Pro |
|-----------|------|--------------|-----------------|-------|----------------|
| MMMU | College-level multimodal | ≥70% | ~70% | ~72% | ~72% |
| MathVista | Math visual reasoning | ≥70% | ~68% | ~70% | ~71% |
| DocVQA | Document understanding | ≥93% | ~92% | ~93% | ~93% |
| ChartQA | Chart understanding | ≥88% | ~87% | ~88% | ~88% |
| TextVQA | Text in images | ≥82% | ~80% | ~82% | ~83% |
| OCRBench | OCR accuracy | ≥85% | ~83% | ~84% | ~85% |
| AI2D | Diagram understanding | ≥85% | ~84% | ~84% | ~86% |
| RealWorldQA | Real-world spatial | ≥72% | ~70% | ~72% | ~73% |
| MMBench | General VLM | ≥85% | ~83% | ~84% | ~85% |
| SEED-Bench | Comprehensive | ≥78% | ~76% | ~77% | ~78% |

---

## 7. Image Input Processing Code (Reference)

```python
# Pseudocode for INCLAW image processing pipeline

class INCLAWVisionProcessor:
    def __init__(self, tile_size=448, max_tiles=12):
        self.tile_size = tile_size
        self.max_tiles = max_tiles
    
    def process_image(self, image):
        """Process a single image into visual tokens."""
        # Step 1: Determine optimal grid
        grid = self._find_best_grid(image.size, self.tile_size, self.max_tiles)
        
        # Step 2: Create thumbnail (global view)
        thumbnail = image.resize((self.tile_size, self.tile_size))
        
        # Step 3: Create tiles (detail views)
        target_size = (grid[1] * self.tile_size, grid[0] * self.tile_size)
        resized = image.resize(target_size)
        tiles = self._split_into_tiles(resized, self.tile_size)
        
        # Step 4: Encode all through vision encoder
        all_images = [thumbnail] + tiles
        vision_features = self.vision_encoder(all_images)  # [N+1, 1024, D]
        
        # Step 5: Pixel shuffle (reduce tokens)
        vision_features = self.pixel_shuffle(vision_features)  # [N+1, 256, D]
        
        # Step 6: Project to LLM space
        visual_tokens = self.adapter(vision_features)  # [N+1, 256, LLM_D]
        
        # Step 7: Flatten
        return visual_tokens.reshape(-1, visual_tokens.shape[-1])
    
    def _find_best_grid(self, image_size, tile_size, max_tiles):
        """Find grid that maximizes effective resolution within budget."""
        width, height = image_size
        aspect = width / height
        
        best_grid = (1, 1)
        best_waste = float('inf')
        
        for rows in range(1, max_tiles + 1):
            for cols in range(1, max_tiles + 1):
                if rows * cols > max_tiles:
                    continue
                
                grid_aspect = cols / rows
                # Calculate waste (unused pixels)
                if grid_aspect > aspect:
                    effective_width = int(rows * tile_size * aspect)
                    waste = (cols * tile_size - effective_width) * rows * tile_size
                else:
                    effective_height = int(cols * tile_size / aspect)
                    waste = (rows * tile_size - effective_height) * cols * tile_size
                
                if waste < best_waste:
                    best_waste = waste
                    best_grid = (rows, cols)
        
        return best_grid
```
