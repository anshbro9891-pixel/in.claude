# INCLAW Image Benchmarks & Evaluation

Comprehensive benchmark suite for evaluating INCLAW's image interpretation capabilities.

---

## 📊 Primary Benchmark Suite

### Tier 1: Must-Pass Benchmarks

| Benchmark | Task Type | Size | Metric | Target | Source |
|-----------|----------|------|--------|--------|--------|
| MMMU | College-level multimodal | 11.5K | Accuracy | ≥70% | `huggingface.co/datasets/MMMU/MMMU` |
| MathVista | Mathematical visual reasoning | 6.1K | Accuracy | ≥70% | `huggingface.co/datasets/AI4Math/MathVista` |
| DocVQA | Document understanding | 50K | ANLS | ≥93% | `huggingface.co/datasets/lmms-lab/DocVQA` |
| ChartQA | Chart understanding | 32K | Accuracy | ≥88% | `huggingface.co/datasets/HuggingFaceM4/ChartQA` |
| TextVQA | Text in natural images | 45K | Accuracy | ≥82% | `huggingface.co/datasets/textvqa` |
| OCRBench | OCR across scenarios | 1K | Score | ≥850/1000 | `github.com/Yuliang-Liu/MultimodalOCR` |
| MMBench | General multimodal | 3K | Accuracy | ≥85% | `huggingface.co/datasets/opencompass/MMBench` |

### Tier 2: Extended Benchmarks

| Benchmark | Task Type | Size | Metric | Target |
|-----------|----------|------|--------|--------|
| AI2D | Science diagram QA | 5K | Accuracy | ≥85% |
| InfoVQA | Infographic understanding | 30K | ANLS | ≥75% |
| RealWorldQA | Real-world spatial | 700+ | Accuracy | ≥72% |
| SEED-Bench-2 | Comprehensive VLM eval | 24K | Accuracy | ≥78% |
| BLINK | Core visual perception | 3.8K | Accuracy | ≥60% |
| ScienceQA (image subset) | Science reasoning | 6K | Accuracy | ≥92% |
| VQAv2 | General VQA | 1.1M | Accuracy | ≥82% |
| GQA | Compositional VQA | 22M | Accuracy | ≥67% |
| OK-VQA | Knowledge-based VQA | 14K | Accuracy | ≥68% |

### Tier 3: Specialized Benchmarks

| Benchmark | Focus | Target |
|-----------|-------|--------|
| POPE | Hallucination detection | ≥88% accuracy |
| HallusionBench | Visual hallucination | ≥65% |
| MMStar | Vision-necessary reasoning | ≥65% |
| MMVet | Integrated visual capabilities | ≥70% |
| WildVision | Real-world user queries | ≥50% (Arena score) |
| ScreenSpot | UI element grounding | ≥80% |
| WebSight | Webpage understanding | ≥75% |

---

## 🔄 Evaluation Pipeline

### Using VLMEvalKit

```bash
# Install VLMEvalKit
git clone https://github.com/open-compass/VLMEvalKit
cd VLMEvalKit
pip install -e .

# Run evaluation
python run.py \
  --model INCLAW \
  --data MMMU_DEV_VAL MathVista_MINI DocVQA_VAL ChartQA_TEST \
       TextVQA_VAL OCRBench MMBench_DEV_EN AI2D_TEST \
       RealWorldQA SEED_IMG
```

### Using lm-evaluation-harness (for text + multimodal)

```bash
# Install
pip install lm_eval[vllm]

# Run multimodal benchmarks
lm_eval --model vllm \
  --model_args pretrained=INCLAW,tensor_parallel_size=8 \
  --tasks mmmu,mathvista,docvqa \
  --batch_size auto
```

---

## 📈 Competitive Analysis

### Current Top Model Scores (as of early 2026)

| Benchmark | Claude Opus 4.6 | GPT-5 | Gemini 2.5 Pro | INCLAW Target |
|-----------|-----------------|-------|----------------|---------------|
| MMMU (val) | 70.2% | 72.1% | 72.5% | ≥70% |
| MathVista | 68.5% | 70.3% | 71.2% | ≥70% |
| DocVQA | 92.1% | 93.4% | 93.1% | ≥93% |
| ChartQA | 87.3% | 88.0% | 88.5% | ≥88% |
| TextVQA | 80.2% | 82.1% | 83.0% | ≥82% |
| OCRBench | 830 | 845 | 852 | ≥850 |
| MMBench | 83.5% | 84.2% | 85.0% | ≥85% |
| AI2D | 84.0% | 84.5% | 86.2% | ≥85% |
| RealWorldQA | 70.5% | 72.0% | 73.1% | ≥72% |
| SEED-Bench | 76.2% | 77.5% | 78.3% | ≥78% |

### Gap Analysis

```yaml
gap_analysis:
  strong_areas:
    - General VQA (VQAv2, GQA) — relatively saturated, easy to match
    - Science QA — strong with good training data
    
  challenging_areas:
    - MMMU — requires deep subject knowledge across 30 disciplines
    - MathVista — requires precise mathematical reasoning from visuals
    - OCRBench — requires pixel-level text accuracy
    - Chart data extraction — exact numerical reading is difficult
    
  key_differentiators_needed:
    - Consistent OCR across languages and fonts
    - Precise numerical reading from charts/graphs
    - Multi-step visual reasoning chains
    - Resistance to visual hallucination
```

---

## 🧪 Custom INCLAW Evaluation Tests

### Test Suite 1: OCR Stress Test
```yaml
ocr_stress_test:
  categories:
    - small_text: "Text at 8pt font in screenshots"
    - rotated_text: "Text at various angles (15°, 45°, 90°)"
    - handwritten: "Handwritten notes in various styles"
    - multilingual: "Mixed language text (EN + CJK + Arabic)"
    - low_quality: "Low-res scans, faded documents"
    - tables: "Complex nested tables with merged cells"
    - formulas: "LaTeX-style mathematical expressions"
  
  evaluation:
    metric: Character Error Rate (CER)
    target: <5% CER on printed text, <15% on handwritten
```

### Test Suite 2: Chart Accuracy Test
```yaml
chart_accuracy_test:
  test_types:
    - value_extraction: "Read exact value for bar at position X"
    - trend_identification: "Is the trend increasing or decreasing?"
    - comparison: "Which category has the highest value?"
    - calculation: "What is the difference between A and B?"
    - inference: "Based on the trend, predict next year's value"
  
  chart_types: [bar, line, pie, scatter, box, heatmap, area]
  
  evaluation:
    metric: "Relative error for numerical extraction; accuracy for QA"
    target: "<10% relative error on value extraction; >85% QA accuracy"
```

### Test Suite 3: Hallucination Resistance Test
```yaml
hallucination_test:
  categories:
    - existence: "Is there a [object] in the image? (test with absent objects)"
    - attribute: "What color is the [object]? (test with wrong attributes)"
    - counting: "How many [objects] are there?"
    - text: "What does the sign say? (test OCR hallucination)"
    - spatial: "Is [A] to the left or right of [B]?"
  
  evaluation:
    metric: accuracy_on_negative_examples
    target: ">88% correct rejection of false claims"
```

### Test Suite 4: Multi-Image Reasoning Test
```yaml
multi_image_test:
  tasks:
    - spot_difference: "Find differences between two similar images"
    - temporal_ordering: "Arrange images in chronological order"
    - cross_reference: "Answer questions requiring info from multiple images"
    - before_after: "Describe what changed between image 1 and image 2"
  
  evaluation:
    metric: accuracy
    target: ">75%"
```

---

## 📋 Evaluation Reporting Template

```markdown
# INCLAW Vision Evaluation Report

## Model: INCLAW v[version]
## Date: [date]
## Evaluator: [automated/human]

### Summary
| Category | Score | Target | Status |
|----------|-------|--------|--------|
| Overall Multimodal | X% | Y% | ✅/❌ |
| Document Understanding | X% | Y% | ✅/❌ |
| Chart Understanding | X% | Y% | ✅/❌ |
| Visual Reasoning | X% | Y% | ✅/❌ |
| OCR Quality | X/1000 | Y/1000 | ✅/❌ |
| Hallucination Resistance | X% | Y% | ✅/❌ |

### Detailed Results
[Individual benchmark scores]

### Failure Analysis
[Common failure patterns and examples]

### Recommendations
[Suggested improvements for next iteration]
```
