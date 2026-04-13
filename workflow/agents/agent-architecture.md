# INCLAW Agentic System Architecture

Design specification for INCLAW's autonomous agent capabilities — enabling it to plan, execute multi-step tasks, use tools, and self-correct like top-tier agentic models.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    INCLAW Agent Architecture                     │
│                                                                  │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐            │
│  │  User      │    │  Planning   │    │  Execution │            │
│  │  Request   │───▶│  Module     │───▶│  Engine    │            │
│  └────────────┘    └─────┬──────┘    └─────┬──────┘            │
│                          │                  │                    │
│                    ┌─────┴──────┐    ┌─────┴──────┐            │
│                    │  Memory    │    │  Tool      │            │
│                    │  System    │◀──▶│  Router    │            │
│                    └────────────┘    └─────┬──────┘            │
│                                           │                    │
│                    ┌──────────────────────┤                    │
│                    │                      │                    │
│              ┌─────┴──────┐    ┌─────────┴────┐              │
│              │ Self-      │    │  Tool        │              │
│              │ Reflection │    │  Execution   │              │
│              │ & Critique │    │  Runtime     │              │
│              └────────────┘    └──────────────┘              │
│                                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Planning Module

### Task Decomposition

INCLAW uses a hierarchical planning approach:

```
User Request: "Fix the failing CI test in my repository"
         │
         ▼
┌─────────────────────────────────┐
│  High-Level Plan                │
│  1. Understand the repository   │
│  2. Identify failing test       │
│  3. Diagnose root cause         │
│  4. Implement fix               │
│  5. Verify fix works            │
│  6. Report results              │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Step 2 Decomposition           │
│  2a. Run test suite             │
│  2b. Parse error output         │
│  2c. Identify specific test     │
│  2d. Read test source code      │
└─────────────────────────────────┘
```

### Planning Strategies

```yaml
planning:
  strategies:
    # Strategy 1: ReAct (Reasoning + Acting)
    react:
      format: |
        Thought: I need to understand the error first
        Action: run_tests
        Observation: Test X failed with error Y
        Thought: The error suggests a null pointer in function Z
        Action: read_file(path="src/Z.py")
        ...
      use_when: "Interactive tasks requiring step-by-step reasoning"
    
    # Strategy 2: Plan-then-Execute
    plan_execute:
      format: |
        <thinking>
        Let me plan the steps:
        1. First, I'll examine the codebase structure
        2. Then, I'll identify the relevant files
        3. Next, I'll make the necessary changes
        4. Finally, I'll test the changes
        </thinking>
        
        Let me start by examining the codebase...
      use_when: "Complex tasks that benefit from upfront planning"
    
    # Strategy 3: Hierarchical Task Decomposition
    hierarchical:
      format: |
        Main Goal: [goal]
        ├── Subgoal 1: [subgoal]
        │   ├── Action 1.1
        │   └── Action 1.2
        ├── Subgoal 2: [subgoal]
        │   ├── Action 2.1
        │   └── Action 2.2
        └── Subgoal 3: [subgoal]
      use_when: "Very complex, multi-part tasks"
```

### Plan Revision

```yaml
plan_revision:
  triggers:
    - "Tool execution fails"
    - "Unexpected observation that invalidates current plan"
    - "New information changes understanding of the task"
    - "Subgoal found to be unnecessary or impossible"
  
  process:
    1. "Detect plan deviation or failure"
    2. "Assess impact on overall plan"
    3. "Generate revised plan"
    4. "Continue execution with revised plan"
  
  example: |
    Original Plan: Edit file X to fix bug
    Observation: File X doesn't exist (was renamed to Y)
    Revised Plan: Edit file Y instead
```

---

## 2. Execution Engine

### Execution Loop

```
┌──────────────────────────────────────────┐
│              Execution Loop               │
│                                          │
│  ┌─────────┐   ┌──────────┐   ┌──────┐ │
│  │ Select  │──▶│ Execute  │──▶│Parse │ │
│  │ Action  │   │ Tool/    │   │Result│ │
│  │         │   │ Generate │   │      │ │
│  └─────────┘   └──────────┘   └──┬───┘ │
│       ▲                          │      │
│       │    ┌──────────┐         │      │
│       └────│ Reflect  │◀────────┘      │
│            │ & Decide │                 │
│            └──────────┘                 │
│              │                          │
│              ├── Continue (next action)  │
│              ├── Revise plan             │
│              └── Finish (task complete)  │
└──────────────────────────────────────────┘
```

### Action Types

```yaml
action_types:
  tool_call:
    description: "Call a specific tool with parameters"
    example: |
      <tool_call>
      {"name": "read_file", "parameters": {"path": "src/main.py"}}
      </tool_call>
  
  code_generation:
    description: "Generate code to solve a problem"
    example: "Write Python function to process data"
  
  text_response:
    description: "Provide information or explanation"
    example: "Based on my analysis, the issue is..."
  
  delegation:
    description: "Delegate subtask to specialized agent"
    example: "Use code review agent to check changes"
  
  information_gathering:
    description: "Search or retrieve information"
    example: "Search codebase for function definition"
```

### Error Handling

```yaml
error_handling:
  strategies:
    retry:
      max_retries: 3
      backoff: "exponential"
      conditions: ["timeout", "transient_error", "rate_limit"]
      
    fallback:
      description: "Try alternative approach when primary fails"
      example: "If web search fails, try reading local docs"
      
    escalation:
      description: "Ask user for help when stuck"
      conditions:
        - "Max retries exhausted"
        - "Ambiguous requirement"
        - "Permission needed"
        - "Confidence too low to proceed"
      
    graceful_failure:
      description: "Report what was accomplished and what failed"
      always: "Explain what went wrong and suggest next steps"
```

---

## 3. Self-Reflection & Critique

### Reflection Triggers

```yaml
reflection:
  after_each_action:
    check: "Did the action produce the expected result?"
    decision: "Continue, revise, or escalate"
    
  after_task_completion:
    check: "Does the result fully address the user's request?"
    verify: "Run tests/checks to validate"
    
  confidence_estimation:
    high: "Proceed with execution"
    medium: "Add verification step"
    low: "Ask for clarification or try alternative approach"
```

### Quality Checks

```yaml
quality_checks:
  code_changes:
    - "Does the code compile/parse?"
    - "Do existing tests still pass?"
    - "Are new tests needed?"
    - "Does the change address the actual issue?"
    - "Are there any obvious bugs or security issues?"
    
  text_responses:
    - "Is the response accurate and factual?"
    - "Does it fully answer the question?"
    - "Is it well-organized and clear?"
    - "Does it acknowledge uncertainty where appropriate?"
    
  tool_use:
    - "Was the right tool selected?"
    - "Were the parameters correct?"
    - "Was the output interpreted correctly?"
```

---

## 4. Multi-Agent Collaboration

### Agent Types

```yaml
agent_types:
  orchestrator:
    role: "Manages overall task execution"
    capabilities: ["planning", "delegation", "synthesis"]
    
  coder:
    role: "Writes, edits, and reviews code"
    capabilities: ["code_generation", "debugging", "testing"]
    
  researcher:
    role: "Gathers information and analyzes"
    capabilities: ["search", "read", "summarize"]
    
  reviewer:
    role: "Reviews and critiques outputs"
    capabilities: ["code_review", "fact_check", "quality_assessment"]
```

### Communication Protocol

```yaml
multi_agent_protocol:
  message_format:
    from: "agent_id"
    to: "agent_id"
    type: "request | response | broadcast"
    content: "message"
    context: "relevant shared state"
    
  coordination:
    - Sequential: "Agent A completes → Agent B starts"
    - Parallel: "Agents A and B work simultaneously"
    - Iterative: "Agent A produces → Agent B critiques → Agent A revises"
```

---

## 5. Training for Agentic Capabilities

### Training Data Sources

```yaml
agentic_training_data:
  trajectory_datasets:
    - name: "Agent-FLAN"
      size: 34K trajectories
      format: "Conversation with actions and observations"
      
    - name: "ToolBench"
      size: 126K instances
      format: "Multi-step tool use traces"
      
    - name: "FireAct"
      size: 20K trajectories
      format: "ReAct-style reasoning traces"
      
    - name: "SWE-bench Agent Traces"
      size: "Generated from successful agent runs"
      format: "Full code editing trajectories"
      
    - name: "Custom Trajectories"
      generation:
        1. "Define diverse tasks"
        2. "Run existing agents (SWE-agent, OpenHands)"
        3. "Filter for successful completions"
        4. "Clean and format trajectories"
        5. "Human review for quality"
```

### Training Method

```yaml
agentic_training_method:
  stage_1_sft:
    data: "Successful agent trajectories"
    format: "Full trajectory as conversation"
    objective: "Predict agent actions given history"
    
  stage_2_rl:
    method: "Task completion reward"
    reward_signal:
      - "Task completed successfully: +1"
      - "Task failed: -1"
      - "Partial completion: proportional reward"
      - "Efficiency bonus: fewer steps = higher reward"
    
  stage_3_self_play:
    process:
      1. "Generate tasks from task distribution"
      2. "INCLAW attempts tasks"
      3. "Filter successful trajectories"
      4. "Train on successful trajectories"
      5. "Repeat with harder tasks"
    benefit: "Self-improving agent through practice"
```

---

## 6. Agentic Benchmarks

| Benchmark | Task | Metric | INCLAW Target |
|-----------|------|--------|---------------|
| SWE-bench Verified | Fix real GitHub issues | % resolved | ≥75% |
| TAU-bench (Retail) | E-commerce agent tasks | Success rate | ≥80% |
| TAU-bench (Airline) | Travel agent tasks | Success rate | ≥75% |
| WebArena | Web navigation tasks | Success rate | ≥35% |
| OSWorld | Full OS agent tasks | Success rate | ≥20% |
| GAIA | General AI assistant | Accuracy | ≥60% |
| ToolBench | API tool use | Win rate | ≥70% |
| AgentBench | Multi-domain agent | Score | ≥80% |
