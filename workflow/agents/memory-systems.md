# INCLAW Memory Systems

Specification for INCLAW's memory and context management systems — enabling persistent knowledge, conversation history, and learned patterns across sessions.

---

## 🧠 Memory Architecture Overview

```
┌────────────────────────────────────────────────────┐
│                INCLAW Memory System                 │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐                │
│  │   Working    │  │   Episodic   │                │
│  │   Memory     │  │   Memory     │                │
│  │  (Context    │  │  (Past       │                │
│  │   Window)    │  │   Sessions)  │                │
│  └──────┬───────┘  └──────┬───────┘                │
│         │                  │                        │
│         ▼                  ▼                        │
│  ┌────────────────────────────────┐                │
│  │       Memory Controller        │                │
│  │  (Decides what to store/recall)│                │
│  └──────────────┬─────────────────┘                │
│                 │                                   │
│         ┌───────┴───────┐                          │
│         ▼               ▼                          │
│  ┌──────────────┐  ┌──────────────┐               │
│  │  Semantic    │  │  Procedural  │               │
│  │  Memory      │  │  Memory      │               │
│  │  (Facts &    │  │  (Skills &   │               │
│  │   Knowledge) │  │   Patterns)  │               │
│  └──────────────┘  └──────────────┘               │
└────────────────────────────────────────────────────┘
```

---

## 1. Working Memory (Context Window)

### The Transformer Context Window

```yaml
working_memory:
  type: "transformer_context_window"
  capacity: 131072 tokens (128K)
  
  characteristics:
    - "Perfect recall within context"
    - "Attention across all tokens"
    - "Degrades gracefully as context fills"
    - "Lost when session ends"
    
  management:
    # Context allocation strategy
    system_prompt: "~500-2000 tokens"
    tool_definitions: "~1000-5000 tokens"
    conversation_history: "~10000-50000 tokens"
    tool_results: "~5000-30000 tokens"
    working_space: "~30000-100000 tokens (for reasoning)"
```

### Context Window Optimization

```yaml
context_optimization:
  # Strategy 1: Summarization
  summarization:
    trigger: "Context usage > 80%"
    method: "Summarize older parts of conversation"
    keep: "Last 10 messages in full + summary of earlier"
    
  # Strategy 2: Tool Result Compression
  tool_compression:
    method: "Only keep relevant portions of tool outputs"
    example: "From a 1000-line file, keep only the relevant 50 lines"
    
  # Strategy 3: Sliding Window
  sliding_window:
    method: "Drop oldest messages first"
    preserve: "System prompt + last N messages"
    
  # Strategy 4: Smart Caching
  smart_caching:
    method: "Cache frequent tool results"
    example: "Directory structure read once, referenced multiple times"
```

---

## 2. Episodic Memory (Cross-Session)

### What is Episodic Memory?

Episodic memory stores specific past interactions, allowing INCLAW to:
- Remember user preferences across sessions
- Recall solutions to previously solved problems
- Build on past conversations

### Implementation

```yaml
episodic_memory:
  storage:
    type: "vector_database + structured_store"
    
    vector_store:
      engine: "ChromaDB / Qdrant / Pinecone"
      embedding_model: "text-embedding-3-large or similar"
      dimensions: 3072
      
    structured_store:
      engine: "PostgreSQL / SQLite"
      schema:
        memories:
          - id: uuid
          - user_id: string
          - session_id: string
          - timestamp: datetime
          - content: text
          - embedding: vector
          - importance: float (0-1)
          - access_count: integer
          - last_accessed: datetime
          - tags: string[]
  
  operations:
    store:
      trigger: "End of each meaningful exchange"
      what_to_store:
        - "Key facts learned about the user"
        - "Solutions to problems (for reuse)"
        - "User preferences and corrections"
        - "Important context for ongoing projects"
      
    recall:
      trigger: "Start of each response generation"
      method: "Semantic search on current context"
      top_k: 5
      relevance_threshold: 0.75
      
    forget:
      method: "Importance-weighted decay"
      formula: "importance × recency_weight × access_frequency"
      prune_below: 0.1
```

### Memory Retrieval Pipeline

```
Current User Message
        │
        ▼
┌─────────────────────┐
│ Generate Query       │
│ Embedding            │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐     ┌──────────────────┐
│ Vector Search        │────▶│ Re-rank Results  │
│ (top 20 candidates)  │     │ (LLM-based)      │
└─────────────────────┘     └────────┬─────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │ Inject Top 5     │
                            │ into Context     │
                            └──────────────────┘
```

---

## 3. Semantic Memory (Knowledge Base)

### What is Semantic Memory?

Learned facts and knowledge that persist across all interactions:
- General knowledge (from pre-training)
- User-specific facts
- Domain knowledge accumulated over time

### Implementation

```yaml
semantic_memory:
  # Level 1: Pre-trained knowledge (in model weights)
  pretrained:
    type: "implicit in model parameters"
    update: "Only via fine-tuning"
    
  # Level 2: Retrieval-Augmented Generation (RAG)
  rag:
    knowledge_base:
      sources:
        - "User-uploaded documents"
        - "Project documentation"
        - "Code repositories"
        - "Web search results (cached)"
      
      indexing:
        chunking:
          method: "recursive_character_splitter"
          chunk_size: 512
          chunk_overlap: 50
        
        embedding:
          model: "text-embedding-3-large"
          batch_size: 100
          
        storage:
          engine: "vector_database"
          index_type: "HNSW"
          
    retrieval:
      query_expansion: true  # Expand query for better recall
      hybrid_search: true    # Vector + BM25 keyword search
      reranking: true        # Cross-encoder reranking
      top_k: 10
  
  # Level 3: Structured knowledge
  structured:
    type: "knowledge_graph"
    entities: "Extracted from interactions"
    relations: "Learned from context"
    example:
      entity: "User's project"
      relations:
        - uses_language: "Python"
        - framework: "FastAPI"
        - database: "PostgreSQL"
        - hosting: "AWS"
```

---

## 4. Procedural Memory (Skills & Patterns)

### What is Procedural Memory?

Learned procedures, workflows, and patterns:
- How to debug specific types of errors
- User's preferred coding style
- Common task patterns

### Implementation

```yaml
procedural_memory:
  # Stored as templates/patterns
  
  patterns:
    - name: "Debug Python Test Failure"
      trigger: "User asks to fix a failing test"
      procedure:
        1. "Run the test to see the error"
        2. "Read the test file"
        3. "Read the source file"
        4. "Identify the root cause"
        5. "Make the fix"
        6. "Verify the fix"
      
    - name: "Code Review"
      trigger: "User asks for code review"
      procedure:
        1. "Read the changed files"
        2. "Check for bugs and logic errors"
        3. "Check for style and best practices"
        4. "Check for security issues"
        5. "Provide structured feedback"
      
    - name: "Write New Feature"
      trigger: "User asks to implement a feature"
      procedure:
        1. "Understand the requirement"
        2. "Explore existing codebase"
        3. "Plan the implementation"
        4. "Write the code"
        5. "Write tests"
        6. "Verify everything works"
  
  learning:
    method: "Extract patterns from successful trajectories"
    update_frequency: "After each successful task completion"
    generalization: "Abstract specific details into reusable templates"
```

---

## 5. Memory-Augmented Generation

### How Memory Integrates with Generation

```
┌──────────────────────────────────────────────────────────┐
│                  INCLAW Response Generation                │
│                                                           │
│  Input: User Message + Conversation History               │
│         │                                                 │
│         ├──▶ Working Memory: Full conversation context     │
│         │                                                 │
│         ├──▶ Episodic Recall: "Last time this user asked  │
│         │    about X, they preferred Y approach"           │
│         │                                                 │
│         ├──▶ Semantic Recall: Retrieve relevant docs/code │
│         │                                                 │
│         └──▶ Procedural Recall: "For this type of task,   │
│              follow these steps..."                        │
│         │                                                 │
│         ▼                                                 │
│  Combined Context → LLM → Response                        │
└──────────────────────────────────────────────────────────┘
```

### Context Assembly

```yaml
context_assembly:
  order:
    1. system_prompt: "Always first"
    2. memory_context: |
        ## Recalled Memories
        - [Episodic] User prefers TypeScript over JavaScript
        - [Semantic] Project uses React 19 with Server Components
        - [Procedural] For React components, use functional style
    3. tool_definitions: "Available tools"
    4. conversation_history: "Recent messages"
    5. current_message: "User's latest input"
    
  budget:
    total: 131072 tokens
    memory_context: "max 5000 tokens"
    tool_definitions: "max 3000 tokens"
    conversation: "remainder"
```

---

## 6. Privacy & Data Handling

```yaml
privacy:
  user_data:
    storage: "Encrypted at rest (AES-256)"
    access: "Only accessible by the owning user"
    retention: "Configurable (default: 90 days)"
    deletion: "User can delete all memories on demand"
    
  what_is_stored:
    allowed:
      - "User preferences and settings"
      - "Project context (with consent)"
      - "Conversation summaries"
      - "Learned patterns (anonymized)"
    
    never_stored:
      - "Passwords or secrets"
      - "Full conversation transcripts (only summaries)"
      - "Personally identifiable information (PII)"
      - "Financial or health data"
      
  consent:
    opt_in: "Memory features require explicit opt-in"
    transparency: "Users can view all stored memories"
    control: "Users can edit or delete individual memories"
```

---

## 7. Training for Memory-Aware Behavior

```yaml
memory_training:
  datasets:
    - "Multi-session conversation datasets (synthetic)"
    - "Memory retrieval and usage examples"
    - "When to store vs. when to recall"
    
  capabilities:
    - "Recognize when past context is relevant"
    - "Properly integrate recalled memories into responses"
    - "Know when to update vs. overwrite memories"
    - "Handle contradictions between memory and new information"
    - "Respect privacy boundaries"
    
  evaluation:
    - "Memory retrieval accuracy"
    - "Cross-session consistency"
    - "Privacy compliance"
    - "Graceful handling of missing memories"
```
