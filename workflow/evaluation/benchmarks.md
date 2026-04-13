# INCLAW Benchmark Suite

Comprehensive evaluation framework for measuring INCLAW's capabilities across all domains.

---

## 📊 Benchmark Categories

### 1. Knowledge & Reasoning

| Benchmark | Type | Size | Metric | INCLAW Target | How to Run |
|-----------|------|------|--------|---------------|------------|
| MMLU | Multiple choice (57 subjects) | 14K questions | Accuracy (5-shot) | ≥90% | lm-evaluation-harness |
| MMLU-Pro | Harder MMLU variant | 12K questions | Accuracy (5-shot) | ≥75% | lm-evaluation-harness |
| GPQA | Graduate-level science | 448 questions | Accuracy (0-shot) | ≥65% | lm-evaluation-harness |
| ARC-Challenge | Science reasoning | 1.1K questions | Accuracy (25-shot) | ≥95% | lm-evaluation-harness |
| HellaSwag | Common sense | 10K questions | Accuracy (10-shot) | ≥87% | lm-evaluation-harness |
| Winogrande | Coreference resolution | 1.3K questions | Accuracy (5-shot) | ≥85% | lm-evaluation-harness |
| TruthfulQA | Truthfulness | 817 questions | MC2 accuracy | ≥70% | lm-evaluation-harness |

### 2. Mathematics

| Benchmark | Type | Size | Metric | INCLAW Target | How to Run |
|-----------|------|------|--------|---------------|------------|
| GSM8K | Grade school math | 1.3K problems | Accuracy (8-shot) | ≥95% | lm-evaluation-harness |
| MATH | Competition math | 5K problems | Accuracy (4-shot) | ≥85% | lm-evaluation-harness |
| MATH-500 | Curated MATH subset | 500 problems | Accuracy (0-shot) | ≥85% | Manual |
| Minerva MATH | Chain-of-thought math | 5K problems | Accuracy | ≥80% | Custom |
| AIME 2024 | AMC competition | 30 problems | Accuracy | ≥50% | Manual |
| Olympiad Bench | International math olympiad | 675 problems | Accuracy | ≥30% | Custom |

### 3. Code Generation

| Benchmark | Type | Size | Metric | INCLAW Target | How to Run |
|-----------|------|------|--------|---------------|------------|
| HumanEval | Python function completion | 164 problems | pass@1 | ≥95% | Custom eval |
| HumanEval+ | Extended test cases | 164 problems | pass@1 | ≥90% | EvalPlus |
| MBPP | Basic Python programming | 974 problems | pass@1 | ≥90% | lm-evaluation-harness |
| MBPP+ | Extended MBPP tests | 399 problems | pass@1 | ≥85% | EvalPlus |
| BigCodeBench | Complex multi-library | 1.1K tasks | pass@1 | ≥70% | BigCodeBench eval |
| MultiPL-E | HumanEval in 18 languages | 164 × 18 | pass@1 | ≥80% (avg) | MultiPL-E eval |
| LiveCodeBench | Rolling competitive programming | Varies | pass@1 | ≥40% | LiveCodeBench |
| CRUXEval | Code reasoning | 800 tasks | Accuracy | ≥85% | Custom |

### 4. Software Engineering (Agentic)

| Benchmark | Type | Size | Metric | INCLAW Target | How to Run |
|-----------|------|------|--------|---------------|------------|
| SWE-bench Verified | Real GitHub issues | 500 tasks | % resolved | ≥75% | SWE-bench harness |
| SWE-bench Full | Full benchmark | 2.3K tasks | % resolved | ≥50% | SWE-bench harness |
| Aider Polyglot | Multi-lang editing | Varies | % correct | ≥80% | Aider eval |

### 5. Instruction Following

| Benchmark | Type | Size | Metric | INCLAW Target | How to Run |
|-----------|------|------|--------|---------------|------------|
| MT-Bench | Multi-turn dialogue | 80 questions | GPT-4 score (1-10) | ≥8.5 | FastChat eval |
| AlpacaEval 2.0 | Single-turn instructions | 805 questions | LC Win Rate | ≥55% | AlpacaEval |
| Arena-Hard | Challenging instructions | 500 questions | Win rate vs GPT-4 | ≥75% | Arena-Hard eval |
| IFEval | Instruction constraint following | 541 prompts | Accuracy | ≥85% | lm-evaluation-harness |
| WildBench | Real user queries | 1K queries | Score | ≥55% | WildBench eval |

### 6. Long Context

| Benchmark | Type | Size | Metric | INCLAW Target | How to Run |
|-----------|------|------|--------|---------------|------------|
| RULER | Multi-task long context | Various | Accuracy at 128K | ≥90% | RULER eval |
| Needle in Haystack | Single fact retrieval | Synthetic | Accuracy at 128K | ≥99% | Custom |
| LongBench | Long-context NLU | 4.7K tasks | F1/Accuracy | ≥55% | LongBench eval |
| InfiniteBench | Very long context | Various | Accuracy at 200K+ | ≥50% | Custom |

### 7. Multimodal (Vision)

| Benchmark | Type | Size | Metric | INCLAW Target | How to Run |
|-----------|------|------|--------|---------------|------------|
| MMMU | College multimodal | 11.5K | Accuracy | ≥70% | VLMEvalKit |
| MathVista | Math visual reasoning | 6.1K | Accuracy | ≥70% | VLMEvalKit |
| DocVQA | Document understanding | 50K | ANLS | ≥93% | VLMEvalKit |
| ChartQA | Chart understanding | 32K | Accuracy | ≥88% | VLMEvalKit |
| TextVQA | Text in images | 45K | Accuracy | ≥82% | VLMEvalKit |
| OCRBench | OCR accuracy | 1K | Score (0-1000) | ≥850 | VLMEvalKit |
| MMBench | General VLM | 3K | Accuracy | ≥85% | VLMEvalKit |

### 8. Safety & Alignment

| Benchmark | Type | Size | Metric | INCLAW Target |
|-----------|------|------|--------|---------------|
| HarmBench | Adversarial attacks | 400+ attacks | ASR (lower=better) | <5% |
| XSTest | Over-refusal detection | 450 prompts | False refusal rate | <10% |
| ToxiGen | Toxicity generation | 6.5K prompts | Toxicity rate | <3% |
| BBQ | Bias in QA | 58K questions | Bias score | <5% |
| BOLD | Bias in open LM | 23.6K prompts | Bias metrics | Low |

### 9. Agentic Capabilities

| Benchmark | Type | Size | Metric | INCLAW Target |
|-----------|------|------|--------|---------------|
| TAU-bench (Retail) | E-commerce agent | 100+ tasks | Success rate | ≥80% |
| TAU-bench (Airline) | Travel agent | 100+ tasks | Success rate | ≥75% |
| WebArena | Web navigation | 812 tasks | Success rate | ≥35% |
| OSWorld | Desktop OS agent | 369 tasks | Success rate | ≥20% |
| GAIA | General AI assistant | 466 questions | Accuracy | ≥60% |
| ToolBench | API tool use | 126K+ | Win rate | ≥70% |

---

## 🔧 Evaluation Tools Setup

### lm-evaluation-harness (Primary)

```bash
# Installation
git clone https://github.com/EleutherAI/lm-evaluation-harness
cd lm-evaluation-harness
pip install -e ".[vllm]"

# Run evaluations
# Text benchmarks
lm_eval --model vllm \
  --model_args pretrained=path/to/INCLAW,tensor_parallel_size=8 \
  --tasks mmlu,hellaswag,arc_challenge,winogrande,gsm8k,truthfulqa_mc2 \
  --batch_size auto \
  --output_path results/

# Code benchmarks
lm_eval --model vllm \
  --model_args pretrained=path/to/INCLAW \
  --tasks humaneval,mbpp \
  --batch_size 1 \
  --output_path results/
```

### VLMEvalKit (Vision)

```bash
# Installation
git clone https://github.com/open-compass/VLMEvalKit
cd VLMEvalKit
pip install -e .

# Run vision evaluations
python run.py \
  --model INCLAW \
  --data MMMU_DEV_VAL MathVista_MINI DocVQA_VAL ChartQA_TEST \
       OCRBench MMBench_DEV_EN AI2D_TEST
```

### SWE-bench (Agent)

```bash
# Installation
git clone https://github.com/princeton-nlp/SWE-bench
pip install -e .

# Run evaluation
python -m swebench.harness.run_evaluation \
  --model_name INCLAW \
  --dataset_name princeton-nlp/SWE-bench_Verified \
  --max_workers 8
```

---

## 📈 Evaluation Schedule

```yaml
evaluation_schedule:
  during_pretraining:
    frequency: "Every 50K steps"
    benchmarks: [MMLU, HellaSwag, HumanEval, GSM8K]
    purpose: "Track capability development"
    
  after_sft:
    benchmarks: "Full text + code benchmark suite"
    add: [MT-Bench, IFEval]
    purpose: "Verify instruction following quality"
    
  after_vision:
    benchmarks: "Full vision benchmark suite"
    add: [MMMU, MathVista, DocVQA, ChartQA, OCRBench]
    purpose: "Verify multimodal capabilities"
    
  after_dpo:
    benchmarks: "Full suite + safety benchmarks"
    add: [HarmBench, XSTest, AlpacaEval]
    purpose: "Verify alignment quality"
    
  after_agentic:
    benchmarks: "Full suite + agentic benchmarks"
    add: [SWE-bench, TAU-bench, WebArena]
    purpose: "Verify agent capabilities"
    
  pre_deployment:
    benchmarks: "Complete benchmark suite"
    additional: "Human evaluation (100 diverse prompts)"
    purpose: "Final sign-off"
```

---

## 📋 Evaluation Report Template

```markdown
# INCLAW Evaluation Report — v{version}

## Date: {date}
## Stage: {pre-training / SFT / DPO / Agentic}

## Summary
| Domain | Score | Target | Status |
|--------|-------|--------|--------|
| Knowledge | X% | Y% | ✅/❌ |
| Math | X% | Y% | ✅/❌ |
| Code | X% | Y% | ✅/❌ |
| Vision | X% | Y% | ✅/❌ |
| Safety | X% | Y% | ✅/❌ |
| Agentic | X% | Y% | ✅/❌ |

## Detailed Scores
[Per-benchmark breakdown]

## Regression Analysis
[Comparison with previous version]

## Areas for Improvement
[Identified weaknesses]

## Recommendation
[Ship / Iterate / Investigate]
```
