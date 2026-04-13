# Text & NLP Training Datasets for INCLAW

Comprehensive catalog of open-source text datasets for pre-training and fine-tuning INCLAW.

---

## 📚 Pre-Training Datasets (Large-Scale Web Text)

### 1. FineWeb (Hugging Face)
- **Size**: 15T tokens / 44TB
- **Description**: Largest curated open-source web dataset, deduplicated and filtered from CommonCrawl
- **License**: ODC-BY
- **Source**: `huggingface.co/datasets/HuggingFaceFW/fineweb`
- **Quality**: Extensive deduplication (MinHash), quality filtering, URL filtering
- **Relevance**: Primary pre-training data source

### 2. FineWeb-Edu
- **Size**: 1.3T tokens
- **Description**: Educational subset of FineWeb, filtered by an LLM classifier for educational content
- **License**: ODC-BY
- **Source**: `huggingface.co/datasets/HuggingFaceFW/fineweb-edu`
- **Relevance**: High-quality knowledge-rich pre-training data

### 3. RedPajama v2
- **Size**: 30T tokens / 100TB raw
- **Description**: Open reproduction of LLaMA training data
- **License**: Apache 2.0
- **Source**: `huggingface.co/datasets/togethercomputer/RedPajama-Data-V2`
- **Components**: CommonCrawl, C4, GitHub, Books, ArXiv, Wikipedia, StackExchange
- **Relevance**: Well-documented training data mix

### 4. The Pile (EleutherAI)
- **Size**: 825 GB / ~300B tokens
- **Description**: Curated diverse English text dataset
- **License**: MIT (collection); individual component licenses vary
- **Source**: `huggingface.co/datasets/EleutherAI/pile`
- **Components** (22 sources):
  - Pile-CC (Common Crawl)
  - PubMed Central & Abstracts
  - Books3
  - OpenWebText2
  - ArXiv
  - GitHub
  - FreeLaw
  - StackExchange
  - USPTO Backgrounds
  - Wikipedia
  - And more...
- **Relevance**: Gold standard for diverse pre-training data composition

### 5. DCLM Baseline (DataComp-LM)
- **Size**: 3.8T tokens
- **Description**: Curated from CommonCrawl using model-based quality filtering
- **License**: Various
- **Source**: `huggingface.co/datasets/mlfoundations/dclm-baseline-1.0`
- **Relevance**: State-of-the-art data curation methodology

### 6. Dolma (AI2)
- **Size**: 3T tokens
- **Description**: Open dataset used to train OLMo models
- **License**: ODC-BY
- **Source**: `huggingface.co/datasets/allenai/dolma`
- **Components**: CommonCrawl, The Stack, peS2o (academic), Project Gutenberg, Wikipedia, Wikibooks
- **Relevance**: Well-documented open pre-training data with full transparency

### 7. SlimPajama (Cerebras)
- **Size**: 627B tokens
- **Description**: Cleaned and deduplicated version of RedPajama
- **License**: Apache 2.0
- **Source**: `huggingface.co/datasets/cerebras/SlimPajama-627B`
- **Relevance**: Efficient pre-training with deduplicated data

### 8. CulturaX
- **Size**: 6.3T tokens across 167 languages
- **Description**: Massive multilingual dataset from mC4 and OSCAR
- **License**: Various
- **Source**: `huggingface.co/datasets/uonlp/CulturaX`
- **Relevance**: Multilingual pre-training data

---

## 📖 Knowledge & Reference Datasets

### Wikipedia
- **Size**: ~4.5B tokens (English), ~20B tokens (all languages)
- **Source**: `huggingface.co/datasets/wikimedia/wikipedia`
- **License**: CC-BY-SA 3.0
- **Update Frequency**: Monthly dumps

### StackExchange
- **Size**: ~15B tokens
- **Source**: archive.org/details/stackexchange
- **License**: CC-BY-SA 4.0
- **Coverage**: 170+ sites including StackOverflow

### ArXiv Papers
- **Size**: ~10B tokens
- **Source**: `huggingface.co/datasets/togethercomputer/RedPajama-Data-1T` (ArXiv subset)
- **License**: Various (most CC-BY)
- **Relevance**: Scientific knowledge, math, reasoning

### PubMed / S2ORC
- **Size**: 81M+ papers (S2ORC)
- **Source**: `huggingface.co/datasets/allenai/peS2o`
- **License**: ODC-BY
- **Relevance**: Medical/scientific knowledge

### Books (Project Gutenberg)
- **Size**: ~70K books
- **Source**: gutenberg.org
- **License**: Public Domain
- **Relevance**: Long-form writing quality and style

---

## 💬 Conversation & Dialogue Datasets

| Dataset | Size | Type | License |
|---------|------|------|---------|
| WildChat-1M | 1M conversations | Real GPT-4 conversations | AI2 ImpACT |
| LMSYS-Chat-1M | 1M conversations | Multi-model arena conversations | CC-BY-NC 4.0 |
| OpenAssistant (OASST2) | 65K conversations | Human-written multi-turn | Apache 2.0 |
| UltraChat | 1.5M dialogues | Synthetic multi-topic dialogues | MIT |
| Aya Dataset | 204K annotations, 65 langs | Multilingual instructions | Apache 2.0 |

---

## 🧮 Math & Reasoning Datasets

| Dataset | Size | Description | License |
|---------|------|-------------|---------|
| OpenWebMath | 14.7B tokens | Math web pages from CommonCrawl | ODC-BY |
| Proof-Pile-2 | 55B tokens | Mathematical text (papers, code, web) | MIT |
| MetaMathQA | 395K questions | Bootstrapped math question augmentation | MIT |
| MATH (Hendrycks) | 12.5K problems | Competition-level math with step-by-step | MIT |
| GSM8K | 8.5K problems | Grade school math with chain-of-thought | MIT |
| NuminaMath | 860K problems | Competition math with solutions | Apache 2.0 |
| MathInstruct | 260K samples | Diverse math instruction data | Apache 2.0 |
| Orca-Math | 200K problems | Synthetic math word problems | MIT |

---

## 📝 Writing & Creative Datasets

| Dataset | Size | Description | License |
|---------|------|-------------|---------|
| Project Gutenberg | 70K+ books | Classic literature, public domain | Public Domain |
| BookCorpus | ~11K books | Unpublished novels | Research only |
| Cosmopedia | 25B tokens | Synthetic textbook-quality content | Apache 2.0 |
| FineWeb-Edu | 1.3T tokens | Educational web content | ODC-BY |

---

## 🔬 Scientific Datasets

| Dataset | Size | Description | License |
|---------|------|-------------|---------|
| peS2o (AI2) | 40M papers | Scientific papers (cleaned S2ORC) | ODC-BY |
| PubMed Central | 5M+ articles | Biomedical literature | Various open access |
| ArXiv | 2M+ papers | Scientific preprints | Various CC |
| USPTO | 5M+ patents | Patent abstracts and descriptions | Public Domain |

---

## 🌐 Multilingual Datasets

| Dataset | Languages | Size | License |
|---------|-----------|------|---------|
| CulturaX | 167 | 6.3T tokens | Various |
| MADLAD-400 | 419 | 2.8T tokens | CC-BY 4.0 |
| Aya Dataset | 65 | 204K annotations | Apache 2.0 |
| OPUS | 500+ | Varies | Various |
| CC-100 | 100 | ~2.5TB | CommonCrawl ToU |

---

## 📊 Recommended Data Mix for INCLAW Pre-Training

Based on analysis of successful open-source models:

```yaml
pre_training_data_mix:
  # Primary sources
  web_text: 60%           # FineWeb + DCLM Baseline
    quality_filter: true
    dedup: minhash
  
  # Knowledge sources  
  educational: 15%         # FineWeb-Edu + Cosmopedia
  scientific: 5%           # ArXiv + peS2o
  wikipedia: 3%            # All languages
  books: 2%                # Project Gutenberg
  
  # Specialized sources
  code: 10%                # The Stack v2 (see code-datasets.md)
  math: 3%                 # OpenWebMath + Proof-Pile-2
  conversation: 2%         # UltraChat (filtered)
  
  # Total target: ~5T tokens minimum for competitive performance
  # Optimal: 10T+ tokens with multi-epoch on high-quality subsets
```

---

## 🔧 Data Processing Pipeline

### Step 1: Collection
- Download from Hugging Face Hub / direct sources
- Maintain provenance tracking for all data

### Step 2: Cleaning
- Remove HTML/boilerplate
- Language identification (fastText lid.176)
- Remove duplicates (MinHash + exact dedup)
- Quality filtering (perplexity-based + classifier-based)
- PII removal (regex + NER-based)
- Toxicity filtering (optional classifier)

### Step 3: Tokenization
- Train custom BPE tokenizer on representative sample
- Vocabulary size: 128K–256K tokens
- Ensure good coverage of code, math, and multilingual text

### Step 4: Mixing & Sampling
- Apply domain weights per the mix above
- Upsampling for high-quality / underrepresented domains
- Temperature-based sampling across domains

### Step 5: Validation
- Hold out validation splits per domain
- Monitor loss curves per domain during training
- Ablation studies on data mix ratios
