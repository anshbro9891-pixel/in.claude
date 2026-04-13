# Contributing to INCLAW

Thank you for your interest in contributing to the INCLAW project! This document outlines how to contribute effectively.

---

## 🤝 How to Contribute

### 1. Training Data Contributions
- **Add new datasets**: Submit PRs adding new open-source datasets to the relevant catalog files in `training-materials/datasets/`
- **Quality annotations**: Help review and annotate dataset quality
- **Data processing**: Contribute data processing scripts and pipelines

### 2. Architecture & Research
- **Propose architectural improvements**: Open issues or PRs with research papers or ideas
- **Benchmark new techniques**: Test new training techniques and report results
- **Ablation studies**: Run experiments comparing different approaches

### 3. Evaluation & Benchmarks
- **Add new benchmarks**: Add entries to `workflow/evaluation/benchmarks.md`
- **Run evaluations**: Test INCLAW against benchmarks and report results
- **Safety testing**: Contribute to red-teaming efforts

### 4. Documentation
- **Fix errors**: Correct inaccuracies in documentation
- **Add guides**: Write tutorials or how-to guides
- **Translate**: Help make documentation available in other languages

---

## 📝 Contribution Process

1. **Fork** the repository
2. **Create a branch** for your changes: `git checkout -b feature/your-feature`
3. **Make your changes** following the style of existing documentation
4. **Test** your changes (ensure links work, formatting is correct)
5. **Submit a PR** with a clear description of what you're adding/changing

---

## 📋 Style Guide

### Documentation Files
- Use Markdown format
- Include YAML code blocks for configurations
- Add tables for structured data (datasets, benchmarks)
- Use hierarchical headers (##, ###, ####)
- Include source links for all datasets and tools
- Note the license for every resource mentioned

### Dataset Entries
When adding a new dataset, include:
```markdown
### Dataset Name
- **Size**: Number of samples/tokens
- **Description**: What it contains
- **License**: The license
- **Source**: URL to download
- **Relevance to INCLAW**: Why it's useful
```

### Benchmark Entries
When adding a new benchmark, include:
```markdown
| Benchmark Name | Task Type | Size | Metric | INCLAW Target | How to Run |
```

---

## ⚖️ License
By contributing, you agree that your contributions will be available under the same license as the rest of the project (educational/research use).

---

## 🙋 Questions?
Open an issue on GitHub if you have questions about contributing.
