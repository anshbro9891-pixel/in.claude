# Code Training Datasets for INCLAW

Comprehensive catalog of open-source code datasets for training INCLAW's code generation and software engineering capabilities.

---

## 💻 Large-Scale Code Pre-Training Datasets

### 1. The Stack v2 (BigCode)
- **Size**: 67.5TB / ~900B+ tokens across 600+ programming languages
- **Description**: Largest open-source code dataset from Software Heritage archive
- **License**: Individual file licenses preserved (permissive subset available)
- **Source**: `huggingface.co/datasets/bigcode/the-stack-v2`
- **Key Features**:
  - Opt-out mechanism for developers
  - License detection per file
  - Near-deduplication applied
  - SWH (Software Heritage) provenance
- **Permissive Subset**: `bigcode/the-stack-v2-dedup` — only permissively licensed code
- **Relevance**: Primary code pre-training dataset

### 2. StarCoder Training Data
- **Size**: ~250B tokens (filtered from The Stack v1)
- **Description**: Curated subset used to train StarCoder models
- **License**: BigCode OpenRAIL-M
- **Source**: Part of The Stack v1
- **Processing**: PII removal, near-dedup, quality filtering
- **Relevance**: Well-documented filtering pipeline

### 3. GitHub Code (Cleaned)
- **Size**: ~700GB
- **Description**: Permissively-licensed GitHub repositories
- **Source**: `huggingface.co/datasets/codeparrot/github-code-clean`
- **License**: Apache 2.0 (collection); individual file licenses
- **Relevance**: Additional code pre-training data

---

## 🔧 Code Instruction & Fine-Tuning Datasets

### Code Generation & Understanding

| Dataset | Size | Description | License |
|---------|------|-------------|---------|
| Code Alpaca | 20K instructions | GPT-3.5 generated code instructions | Apache 2.0 |
| CodeFeedback-Filtered | 157K instructions | Multi-turn code conversations | Apache 2.0 |
| Evol-CodeAlpaca | 111K instructions | Evolved code instructions (WizardCoder method) | Apache 2.0 |
| OSS-Instruct | 75K instructions | Instructions from open-source code seeds | Apache 2.0 |
| Self-OSS-Instruct | 75K instructions | Self-improvement on OSS-Instruct | Apache 2.0 |
| CodeExercises | 118K problems | Programming exercises with solutions | Apache 2.0 |
| Magicoder-Evol-110K | 110K instructions | Evolved synthetic coding problems | Apache 2.0 |
| glaive-code-assistant-v3 | 950K instructions | Synthetic code assistant conversations | Apache 2.0 |

### Code Review & Debugging

| Dataset | Size | Description | License |
|---------|------|-------------|---------|
| CodeReviewer | 150K diffs + reviews | Code review comments and suggestions | Apache 2.0 |
| Bug2Fix | 120K bug-fix pairs | Buggy code → Fixed code pairs | MIT |
| DebugBench | 4K bugs across 4 languages | Categorized debugging problems | MIT |

### Software Engineering Datasets

| Dataset | Size | Description | License |
|---------|------|-------------|---------|
| SWE-bench | 2,294 tasks | Real GitHub issues + PRs (Python) | MIT |
| SWE-bench Verified | 500 tasks | Human-verified subset of SWE-bench | MIT |
| SWE-bench Multimodal | 617 tasks | SWE tasks with visual context | MIT |
| DevBench | 22 repos | Full software development lifecycle | Apache 2.0 |
| RepoExec | 355 functions | Repository-level code execution | Apache 2.0 |
| CrossCodeEval | 10K tasks | Cross-file code completion | Apache 2.0 |

---

## ✅ Code Benchmarks (Used for Evaluation)

| Benchmark | Size | Task | Metric | Top Score Reference |
|-----------|------|------|--------|-------------------|
| HumanEval | 164 problems | Function completion (Python) | pass@1 | ~95% (GPT-5, Claude Opus 4.6) |
| HumanEval+ | 164 problems | Extended test cases | pass@1 | ~90% |
| MBPP | 974 problems | Basic Python programming | pass@1 | ~90% |
| MBPP+ | 399 problems | Extended MBPP test cases | pass@1 | ~85% |
| MultiPL-E | 164 × 18 langs | HumanEval in 18 languages | pass@1 | Varies by language |
| LiveCodeBench | Rolling | New competitive programming | pass@1 | ~40% (hard) |
| BigCodeBench | 1,140 tasks | Complex, multi-library coding | pass@1 | ~70% |
| SWE-bench Verified | 500 tasks | Real bug fixes | % resolved | ~75% (Claude Opus 4.6) |
| Aider Polyglot | Various | Multi-language editing | % correct | ~80% |
| CRUXEval | 800 tasks | Code reasoning (input/output) | accuracy | ~85% |

---

## 🔤 Fill-in-the-Middle (FIM) Training

Critical for code completion (IDE integration):

```
# Standard Left-to-Right
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Fill-in-the-Middle Format
<fim_prefix>def fibonacci(n):
    if n <= 1:
        return n
    <fim_suffix>
    return fibonacci(n-1) + fibonacci(n-2)<fim_middle>    else:
```

### FIM Training Configuration
```yaml
fim_training:
  rate: 0.5           # 50% of examples use FIM format
  prefix_token: "<fim_prefix>"
  middle_token: "<fim_middle>"
  suffix_token: "<fim_suffix>"
  mode: "PSM"          # Prefix-Suffix-Middle ordering
  context_window: 8192  # Tokens of surrounding context
```

---

## 🏗️ Repository-Level Training

For understanding full codebases (critical for SWE-bench performance):

### Data Collection
```yaml
repo_level_training:
  sources:
    - GitHub top-starred repos (>100 stars, permissive license)
    - GitLab public repos
    - Open-source projects from Apache, Eclipse, CNCF foundations
  
  processing:
    - Parse repository structure (file tree)
    - Extract dependency graphs
    - Build call graphs per file
    - Include README, docs, tests alongside source
    - Maintain file-level context windows
  
  training_format:
    # Repository context → Task
    context: |
      Repository: {repo_name}
      Structure: {file_tree}
      File: {current_file}
      Related files: {imports/dependencies}
    task: "Complete/fix/review this code"
```

### Repository-Level Datasets

| Dataset | Description | Size | License |
|---------|-------------|------|---------|
| RepoEval | Repository-level code completion | 1.6K tasks | MIT |
| CrossCodeEval | Cross-file completion | 10K tasks | Apache 2.0 |
| RepoBench | Repository understanding benchmark | 7.5K tasks | Apache 2.0 |
| DevEval | End-to-end development tasks | 1.9K tasks | Apache 2.0 |

---

## 📊 Recommended Code Training Pipeline for INCLAW

### Phase 1: Code Pre-Training
```yaml
code_pretraining:
  dataset: The Stack v2 (permissive subset)
  tokens: ~200B code tokens
  languages:
    tier1: [Python, JavaScript, TypeScript, Java, C++, Go, Rust, C#]
    tier2: [Ruby, PHP, Swift, Kotlin, Scala, R, Julia, Lua]
    tier3: [All remaining 600+ languages]
  fim_rate: 0.5
  dedup: true
  quality_filter:
    - Remove auto-generated code
    - Remove minified code
    - Filter by star count / fork count
    - Remove very short files (<10 lines)
    - Remove very long files (>10K lines)
```

### Phase 2: Code Instruction Tuning
```yaml
code_instruction_tuning:
  datasets:
    - Evol-CodeAlpaca (111K)
    - CodeFeedback-Filtered (157K)
    - OSS-Instruct (75K)
    - Magicoder-Evol (110K)
    - glaive-code-assistant-v3 (subset 200K)
  format: chat_template
  epochs: 2
  lr: 2e-5
```

### Phase 3: Software Engineering Training
```yaml
swe_training:
  datasets:
    - SWE-bench training traces (agent trajectories)
    - CodeReviewer (150K)
    - Bug2Fix (120K)
    - Repository-level context data
  focus:
    - Issue → Code change mapping
    - Multi-file editing
    - Test generation
    - Code review
  format: agentic_trajectory
```

### Phase 4: Agentic Code Capabilities
```yaml
agentic_code:
  capabilities:
    - File search and navigation
    - Shell command execution
    - Git operations (diff, commit, branch)
    - Test execution and interpretation
    - Error diagnosis and fixing
    - Multi-step code changes
  training_data:
    - Successful SWE-bench agent traces
    - IDE action sequences
    - Terminal session logs
    - Code review conversations
```
