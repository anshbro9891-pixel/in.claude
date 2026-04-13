# INCLAW Fine-Tuning Pipeline

Detailed specification for supervised fine-tuning (SFT) to transform the INCLAW base model into an instruction-following assistant.

---

## 🎯 Objective

Transform INCLAW-base into INCLAW-Instruct: a helpful, harmless, and honest AI assistant that follows instructions accurately, produces high-quality outputs, and excels at code, math, reasoning, and multimodal tasks.

---

## 📊 Training Data

### Data Mix

```yaml
sft_data_mix:
  total_samples: ~2M instructions
  
  general_instruction:
    - name: "Tulu 3 SFT Mix"
      samples: 600K
      weight: 0.30
      source: "allenai/tulu-3-sft-mixture"
      quality: "⭐⭐⭐ State-of-the-art curated mix"
      
    - name: "OpenHermes 2.5 (filtered)"
      samples: 400K
      weight: 0.20
      source: "teknium/OpenHermes-2.5"
      quality: "⭐⭐⭐ High-quality synthetic"
      filter: "Remove duplicates, low-quality, toxic"
      
    - name: "WildChat (filtered)"
      samples: 300K
      weight: 0.15
      source: "allenai/WildChat-1M"
      quality: "⭐⭐⭐ Real user conversations"
      filter: "Remove PII, toxic, very short"
  
  code_instruction:
    - name: "Code Instruction Mix"
      samples: 300K
      weight: 0.15
      components:
        - Evol-CodeAlpaca (111K)
        - CodeFeedback-Filtered (100K subset)
        - Magicoder-Evol (89K)
      
  conversation:
    - name: "UltraChat 200K"
      samples: 200K
      weight: 0.10
      source: "HuggingFaceH4/ultrachat_200k"
      
  high_quality:
    - name: "Magpie-Pro-300K"
      samples: 100K
      weight: 0.05
      source: "Magpie-Align/Magpie-Pro-300K-Filtered"
      
  math_reasoning:
    - name: "Math Instruction Mix"
      samples: 100K
      weight: 0.05
      components:
        - MetaMathQA (50K subset)
        - NuminaMath-CoT (30K subset)
        - Orca-Math (20K subset)
```

### Data Format

```yaml
# Chat format (all data converted to this)
format:
  type: "chat_messages"
  
  example:
    messages:
      - role: "system"
        content: "You are INCLAW, a helpful AI assistant."
      - role: "user"
        content: "Write a Python function to find the longest palindromic substring."
      - role: "assistant"
        content: |
          Here's an efficient solution using dynamic programming:
          
          ```python
          def longest_palindrome(s: str) -> str:
              ...
          ```
          
          This runs in O(n²) time and O(n²) space.
  
  # Loss masking: Only compute loss on assistant turns
  loss_mask:
    system: false    # Don't train on system prompt
    user: false      # Don't train on user messages
    assistant: true  # Train on assistant responses only
```

### Data Quality Filters

```yaml
quality_filters:
  # Applied to all datasets
  
  length:
    min_input_tokens: 10
    max_input_tokens: 4096
    min_output_tokens: 20
    max_output_tokens: 8192
    
  content:
    remove_empty_responses: true
    remove_refusal_only: true       # "I can't help with that" only
    remove_exact_duplicates: true
    remove_near_duplicates: true    # SimHash similarity > 0.9
    
  language:
    primary: "en"
    allowed: ["en", "zh", "es", "fr", "de", "ja", "ko", "pt", "ru", "ar"]
    
  safety:
    remove_toxic: true              # Toxicity classifier threshold > 0.8
    remove_pii: true                # Regex + NER based
```

---

## 🔧 Training Configuration

### Hyperparameters

```yaml
sft_training:
  # Optimization
  optimizer: "adamw"
  learning_rate: 2.0e-5
  lr_scheduler: "cosine"
  warmup_ratio: 0.03
  weight_decay: 0.0               # No weight decay for SFT
  max_grad_norm: 1.0
  
  # Training duration
  num_epochs: 2
  
  # Batch size
  per_device_batch_size: 2
  gradient_accumulation_steps: 8
  total_batch_size: 128           # 2 × 8 × 8 GPUs = 128
  
  # Sequence
  max_seq_length: 8192
  packing: true                    # Pack multiple short examples
  
  # Precision
  bf16: true
  tf32: true
  
  # Memory
  gradient_checkpointing: true
  flash_attention: true
  
  # Framework
  framework: "huggingface_trl"
  trainer_class: "SFTTrainer"
```

### Training Script (Reference)

```python
# Reference: Using HF TRL for SFT
from trl import SFTTrainer, SFTConfig
from transformers import AutoModelForCausalLM, AutoTokenizer
from datasets import load_dataset

# Load base model
model = AutoModelForCausalLM.from_pretrained(
    "INCLAW-70B-base",
    torch_dtype=torch.bfloat16,
    attn_implementation="flash_attention_2",
)
tokenizer = AutoTokenizer.from_pretrained("INCLAW-70B-base")

# Load and prepare data
dataset = load_dataset("path/to/sft_mix")

# Configure trainer
training_args = SFTConfig(
    output_dir="./inclaw-70b-sft",
    num_train_epochs=2,
    per_device_train_batch_size=2,
    gradient_accumulation_steps=8,
    learning_rate=2e-5,
    lr_scheduler_type="cosine",
    warmup_ratio=0.03,
    bf16=True,
    max_seq_length=8192,
    packing=True,
    gradient_checkpointing=True,
    logging_steps=10,
    save_steps=500,
    eval_steps=500,
    save_total_limit=3,
)

trainer = SFTTrainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    eval_dataset=dataset["validation"],
    tokenizer=tokenizer,
)

trainer.train()
```

---

## 📈 Monitoring & Validation

### Training Metrics

```yaml
monitoring:
  log_every: 10 steps
  
  metrics:
    - training_loss
    - learning_rate
    - gradient_norm
    - tokens_per_second
    - epoch_progress
    
  validation:
    eval_every: 500 steps
    eval_dataset_size: 5000 samples
    metrics:
      - eval_loss
      - eval_perplexity
```

### Checkpoint Selection

```yaml
checkpoint_selection:
  strategy: "best_eval_loss + benchmark_scores"
  
  process:
    1. "Save checkpoints every 500 steps"
    2. "Run validation loss on held-out data"
    3. "Run quick benchmarks (MMLU, HumanEval, GSM8K)"
    4. "Select checkpoint with best combined score"
    5. "Optionally merge final 3 checkpoints (model soup)"
  
  expected_results:
    # After SFT (before DPO)
    mmlu_5shot: "~82-85%"
    humaneval_0shot: "~80-85%"
    gsm8k_8shot: "~85-88%"
    mt_bench: "~7.5-8.0"
```

---

## 🔄 Post-SFT: System Prompt & Chat Template

```yaml
system_prompt:
  default: |
    You are INCLAW, an advanced AI assistant created to be helpful, harmless, and honest.
    You excel at reasoning, coding, mathematics, and creative tasks.
    You provide thorough, accurate, and well-structured responses.
    When you're unsure, you acknowledge uncertainty rather than guessing.
    You follow instructions carefully and ask for clarification when needed.

chat_template: |
  <|begin_of_text|><|start_header_id|>system<|end_header_id|>
  
  {system_message}<|eot_id|>
  <|start_header_id|>user<|end_header_id|>
  
  {user_message}<|eot_id|>
  <|start_header_id|>assistant<|end_header_id|>
  
  {assistant_response}<|eot_id|>
```

---

## 📋 SFT Checklist

- [ ] All SFT datasets downloaded and processed
- [ ] Data quality filters applied
- [ ] Chat format conversion verified
- [ ] Base model loaded and verified
- [ ] Training hyperparameters configured
- [ ] Small-scale test run completed (1000 steps)
- [ ] Full SFT training launched
- [ ] Validation loss monitored (should decrease)
- [ ] Checkpoints saved and evaluated
- [ ] Best checkpoint selected
- [ ] Quick benchmarks run (MMLU, HumanEval, GSM8K)
- [ ] MT-Bench or AlpacaEval run
- [ ] Model ready for DPO/RLHF stage
