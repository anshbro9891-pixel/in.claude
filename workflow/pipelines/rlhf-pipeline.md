# INCLAW RLHF & Alignment Pipeline

Detailed specification for aligning INCLAW using Direct Preference Optimization (DPO), Reinforcement Learning from Human Feedback (RLHF), and safety training.

---

## 🎯 Objective

Align INCLAW-SFT to be maximally helpful while being safe, honest, and well-calibrated. This stage transforms a capable but unrefined instruction-follower into a polished, trustworthy AI assistant.

---

## 📊 Alignment Methods Overview

```
INCLAW-SFT (from fine-tuning stage)
         │
         ├──▶ Path A: DPO (Recommended — simpler)
         │     └── Direct optimization on preference pairs
         │
         ├──▶ Path B: RLHF (PPO) (More powerful — complex)
         │     ├── Train Reward Model
         │     └── PPO optimization against reward
         │
         └──▶ Path C: Hybrid (Best results)
               ├── DPO first (rough alignment)
               └── PPO refinement (polish)
```

---

## Path A: Direct Preference Optimization (DPO)

### DPO Data

```yaml
dpo_data:
  total_pairs: ~300K preference pairs
  
  datasets:
    - name: "Tulu 3 Preference Mix"
      pairs: 105K
      weight: 0.35
      source: "allenai/tulu-3-pref-mixture"
      quality: "⭐⭐⭐ State-of-the-art curated preferences"
      
    - name: "UltraFeedback Binarized"
      pairs: 64K
      weight: 0.25
      source: "HuggingFaceH4/ultrafeedback_binarized"
      quality: "⭐⭐⭐ GPT-4 judged, well-calibrated"
      
    - name: "HH-RLHF"
      pairs: 60K
      weight: 0.20
      source: "Anthropic/hh-rlhf"
      quality: "⭐⭐⭐ Gold standard human preferences"
      
    - name: "Skywork Reward 80K"
      pairs: 30K
      weight: 0.10
      source: "Skywork/Skywork-Reward-Preference-80K-v0.2"
      quality: "⭐⭐⭐ High-quality annotated pairs"
      
    - name: "Vision Preference Data"
      pairs: 30K
      weight: 0.10
      source: "Custom generated"
      quality: "⭐⭐ Synthetic visual preference pairs"
```

### DPO Training Configuration

```yaml
dpo_training:
  # Core DPO hyperparameters
  beta: 0.1                        # DPO temperature (controls deviation from reference)
  loss_type: "sigmoid"             # Standard DPO loss
  label_smoothing: 0.0             # No label smoothing
  
  # Reference model
  reference_model: "INCLAW-SFT"   # Same as starting model (frozen copy)
  
  # Optimization
  optimizer: "adamw"
  learning_rate: 5.0e-7            # Very low LR for alignment
  lr_scheduler: "cosine"
  warmup_ratio: 0.1
  weight_decay: 0.0
  max_grad_norm: 1.0
  
  # Training
  num_epochs: 1                    # Usually 1 epoch is sufficient
  per_device_batch_size: 1         # Small batch (DPO is memory-heavy)
  gradient_accumulation_steps: 8
  total_batch_size: 64
  
  # Sequence
  max_seq_length: 4096
  max_prompt_length: 2048
  
  # Precision & memory
  bf16: true
  gradient_checkpointing: true
  
  # Framework
  framework: "huggingface_trl"
  trainer_class: "DPOTrainer"
  
  # Compute
  num_gpus: 64
  estimated_time: "~2 days"
```

### DPO Monitoring

```yaml
dpo_monitoring:
  metrics:
    - dpo_loss: "Should decrease steadily"
    - chosen_rewards: "Should increase (chosen responses scored higher)"
    - rejected_rewards: "Should decrease (rejected responses scored lower)"
    - reward_margin: "chosen_reward - rejected_reward (should increase)"
    - reward_accuracy: "% of pairs where chosen > rejected (should be >70%)"
    - kl_divergence: "From reference model (should stay reasonable, <5)"
    
  expected_curves:
    dpo_loss: "Starts ~0.69 (random), decreases to ~0.4-0.5"
    reward_accuracy: "Starts ~50%, increases to ~75-85%"
    reward_margin: "Starts ~0, increases to ~1-3"
```

---

## Path B: RLHF with PPO

### Step 1: Train Reward Model

```yaml
reward_model:
  base: "INCLAW-SFT"              # Start from SFT model
  architecture: "Same as policy model with reward head"
  
  # Replace LM head with scalar reward head
  reward_head:
    type: "linear"
    input_dim: 8192                # LLM hidden size
    output_dim: 1                  # Scalar reward
  
  training_data:
    - UltraFeedback (64K prompts, 256K responses with ratings)
    - Chatbot Arena data (pairwise comparisons)
    - Skywork Reward 80K (high-quality pairs)
    - HH-RLHF (170K comparisons)
  
  training:
    objective: "Bradley-Terry pairwise ranking loss"
    learning_rate: 1.0e-5
    epochs: 1
    batch_size: 64
    
  evaluation:
    metric: "Pairwise accuracy on held-out preferences"
    target: ">75% accuracy"
```

### Step 2: PPO Training

```yaml
ppo_training:
  # Policy model: INCLAW-SFT
  # Reward model: Trained above
  # Reference model: INCLAW-SFT (frozen)
  
  # PPO hyperparameters
  learning_rate: 1.0e-6
  kl_penalty_coefficient: 0.05    # Penalize deviation from reference
  clip_range: 0.2                 # PPO clipping
  value_loss_coefficient: 0.1     # Value function loss weight
  entropy_coefficient: 0.01       # Exploration bonus
  
  # Rollout
  rollout_batch_size: 512         # Prompts per batch
  num_rollouts_per_prompt: 1      # Responses per prompt
  max_response_length: 1024       # Tokens per response
  
  # PPO optimization
  ppo_epochs: 4                   # PPO epochs per batch
  mini_batch_size: 64
  
  # Training
  total_steps: 10000
  
  # Prompts
  prompt_dataset: "Diverse prompts from SFT data + new prompts"
  
  # Compute
  num_gpus: 128                   # PPO is compute-heavy
  estimated_time: "~1 week"
```

---

## Safety Alignment

### Constitutional AI Process

```yaml
constitutional_ai:
  # Step 1: Generate diverse responses to sensitive prompts
  generation:
    prompts: "Safety-sensitive prompts from BeaverTails, WildGuard, custom"
    num_responses_per_prompt: 4
    temperature: 1.0
    
  # Step 2: AI Critique
  critique:
    model: "INCLAW-SFT (or external judge)"
    principles:
      - "Is this response helpful without being harmful?"
      - "Does it refuse appropriately when asked to help with harmful tasks?"
      - "Is it honest about limitations and uncertainties?"
      - "Does it treat all people fairly and respectfully?"
      - "Does it avoid generating explicit, violent, or illegal content?"
    
  # Step 3: AI Revision
  revision:
    process: "Use critique to improve response"
    num_revisions: 1-2
    
  # Step 4: Create preference pairs
  preference_pairs:
    chosen: "Revised (improved) response"
    rejected: "Original (unrevised) response"
    
  # Step 5: DPO on safety pairs
  safety_dpo:
    data: "Constitutional AI pairs + BeaverTails + WildGuard"
    beta: 0.05                    # Lower beta = stronger alignment
    learning_rate: 1.0e-7
    epochs: 1
```

### Safety Evaluation

```yaml
safety_evaluation:
  # Run after each alignment stage
  
  tests:
    - name: "HarmBench"
      description: "Adversarial attack resistance"
      metric: "Attack success rate"
      target: "<5% (lower is better)"
      
    - name: "XSTest"
      description: "Over-refusal calibration"
      metric: "False refusal rate"
      target: "<10% (should not refuse safe requests)"
      
    - name: "ToxiGen"
      description: "Toxicity generation"
      metric: "Toxicity rate"
      target: "<3%"
      
    - name: "BeaverTails Categories"
      description: "14 harm category coverage"
      metric: "Refusal rate per category"
      target: ">95% refusal on harmful requests"
      
    - name: "Red Team Manual"
      description: "Manual adversarial testing"
      categories:
        - Harmful instructions
        - Bias and discrimination
        - Privacy violations
        - Deception and manipulation
        - Illegal activities
      target: "Pass all categories"
```

### Over-Refusal Prevention

```yaml
over_refusal_prevention:
  # Problem: Model refuses too many safe requests
  
  calibration_data:
    - XSTest prompts (safe prompts that look unsafe)
    - Edge cases (ambiguous but ultimately safe requests)
    - Academic/educational questions about sensitive topics
    
  training:
    # Include examples where the model SHOULD respond
    positive_examples:
      - "How does a nuclear reactor work?" → Provide educational answer
      - "What are the symptoms of depression?" → Provide helpful info
      - "Write a story about a villain" → Creative writing is OK
      
  monitoring:
    metric: "False refusal rate on safe prompt set"
    target: "<10%"
    alert_threshold: ">15%"
```

---

## 📈 Post-Alignment Evaluation

### Comprehensive Benchmark Suite

```yaml
post_alignment_evaluation:
  # Quality benchmarks (should not regress)
  quality:
    - MMLU (5-shot): target ≥88%
    - HumanEval (0-shot): target ≥90%
    - GSM8K (8-shot): target ≥90%
    - MATH (4-shot): target ≥80%
    - GPQA (0-shot): target ≥60%
    
  # Instruction following
  instruction:
    - MT-Bench: target ≥8.5/10
    - AlpacaEval 2.0 LC: target ≥50%
    - IFEval: target ≥80%
    - Arena-Hard: target ≥70%
    
  # Safety
  safety:
    - HarmBench: target <5% ASR
    - XSTest: target <10% false refusal
    - ToxiGen: target <3% toxicity
    
  # Agentic
  agentic:
    - SWE-bench Verified: target ≥70%
    - TAU-bench: target ≥75%
    - Tool-use accuracy: target ≥90%
```

---

## 📋 RLHF Pipeline Checklist

### DPO Path
- [ ] Preference datasets downloaded and processed
- [ ] Preference pairs formatted (chosen/rejected)
- [ ] Reference model prepared (frozen copy of SFT)
- [ ] DPO training configured
- [ ] Small-scale test (100 steps)
- [ ] Full DPO training (1 epoch)
- [ ] Monitor: reward accuracy, margin, KL
- [ ] Post-DPO benchmark evaluation
- [ ] Safety evaluation suite
- [ ] Over-refusal check (XSTest)

### Safety Alignment
- [ ] Safety prompts collected
- [ ] Constitutional AI principles defined
- [ ] AI critique and revision pipeline built
- [ ] Safety preference pairs generated
- [ ] Safety DPO training
- [ ] HarmBench evaluation
- [ ] XSTest calibration
- [ ] Red team testing
- [ ] Final safety sign-off
