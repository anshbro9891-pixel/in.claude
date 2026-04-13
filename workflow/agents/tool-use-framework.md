# INCLAW Tool-Use & Function Calling Framework

Specification for INCLAW's tool-use capabilities, enabling it to interact with external systems, execute code, browse the web, and manipulate files.

---

## 🔧 Tool-Use Architecture

```
User Request
     │
     ▼
┌──────────────┐     ┌───────────────┐
│  INCLAW LLM  │────▶│ Tool Router   │
│  (decides to │     │ (parse tool   │
│  use a tool) │     │  call JSON)   │
└──────────────┘     └───────┬───────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ Code     │  │ Web      │  │ File     │
        │ Executor │  │ Browser  │  │ System   │
        └────┬─────┘  └────┬─────┘  └────┬─────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
                             ▼
                    ┌──────────────┐
                    │ Tool Result  │
                    │ → Back to LLM│
                    └──────────────┘
```

---

## 1. Function Calling Format

### Tool Definition Schema

```json
{
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "read_file",
        "description": "Read the contents of a file at the given path",
        "parameters": {
          "type": "object",
          "properties": {
            "path": {
              "type": "string",
              "description": "Absolute path to the file to read"
            },
            "start_line": {
              "type": "integer",
              "description": "Optional: starting line number (1-indexed)"
            },
            "end_line": {
              "type": "integer",
              "description": "Optional: ending line number (inclusive)"
            }
          },
          "required": ["path"]
        }
      }
    }
  ]
}
```

### Tool Call Format

```
# INCLAW generates:
<tool_call>
{"name": "read_file", "parameters": {"path": "/src/main.py", "start_line": 1, "end_line": 50}}
</tool_call>

# System returns:
<tool_result>
{"content": "import os\nimport sys\n\ndef main():\n    ..."}
</tool_result>
```

### Parallel Tool Calls

```
# INCLAW can call multiple tools simultaneously:
<tool_call>
{"name": "read_file", "parameters": {"path": "/src/main.py"}}
</tool_call>
<tool_call>
{"name": "read_file", "parameters": {"path": "/src/utils.py"}}
</tool_call>
<tool_call>
{"name": "list_directory", "parameters": {"path": "/tests/"}}
</tool_call>

# System returns all results:
<tool_result id="1">
{"content": "...main.py contents..."}
</tool_result>
<tool_result id="2">
{"content": "...utils.py contents..."}
</tool_result>
<tool_result id="3">
{"content": ["test_main.py", "test_utils.py", "conftest.py"]}
</tool_result>
```

---

## 2. Built-In Tools

### 2.1 Code Execution

```yaml
code_execution:
  name: "execute_code"
  description: "Execute code in a sandboxed environment"
  
  supported_languages:
    - python: "Python 3.11+ with common libraries"
    - javascript: "Node.js 20+ runtime"
    - bash: "Bash shell commands"
    
  parameters:
    language: "string (required)"
    code: "string (required)"
    timeout: "integer (default: 30 seconds)"
    
  sandboxing:
    method: "Docker container / gVisor"
    network: "restricted (no external access by default)"
    filesystem: "isolated workspace"
    memory_limit: "512MB"
    cpu_limit: "2 cores"
    
  output:
    stdout: "captured"
    stderr: "captured"
    return_value: "captured (if applicable)"
    files_created: "listed"
```

### 2.2 File Operations

```yaml
file_operations:
  tools:
    - name: "read_file"
      description: "Read file contents"
      parameters: {path, start_line?, end_line?}
      
    - name: "write_file"
      description: "Write/create a file"
      parameters: {path, content}
      
    - name: "edit_file"
      description: "Make targeted edits to a file"
      parameters: {path, old_text, new_text}
      
    - name: "list_directory"
      description: "List files and subdirectories"
      parameters: {path, recursive?, max_depth?}
      
    - name: "search_files"
      description: "Search for text patterns in files"
      parameters: {pattern, path?, file_type?, case_sensitive?}
      
    - name: "delete_file"
      description: "Delete a file"
      parameters: {path}
      
    - name: "move_file"
      description: "Move or rename a file"
      parameters: {source, destination}
```

### 2.3 Web Tools

```yaml
web_tools:
  tools:
    - name: "web_search"
      description: "Search the internet for information"
      parameters:
        query: "string (required)"
        num_results: "integer (default: 5)"
      output: "List of {title, url, snippet}"
      
    - name: "web_browse"
      description: "Navigate to a URL and read page content"
      parameters:
        url: "string (required)"
        extract_mode: "text | markdown | html"
      output: "Page content as text/markdown"
      
    - name: "web_screenshot"
      description: "Take a screenshot of a web page"
      parameters:
        url: "string (required)"
        viewport: "{width, height}"
      output: "Image (fed through vision pipeline)"
```

### 2.4 Git Operations

```yaml
git_tools:
  tools:
    - name: "git_status"
      description: "Show working directory status"
      
    - name: "git_diff"
      description: "Show changes in working directory or between commits"
      parameters: {ref1?, ref2?, file?}
      
    - name: "git_log"
      description: "Show commit history"
      parameters: {num_commits?, file?, author?}
      
    - name: "git_commit"
      description: "Create a commit"
      parameters: {message, files?}
      
    - name: "git_branch"
      description: "List, create, or switch branches"
      parameters: {action, name?}
```

### 2.5 Calculator & Data Tools

```yaml
utility_tools:
  tools:
    - name: "calculator"
      description: "Evaluate mathematical expressions"
      parameters: {expression}
      engine: "Python eval with math/numpy"
      
    - name: "json_query"
      description: "Query JSON data with JMESPath"
      parameters: {data, query}
      
    - name: "date_time"
      description: "Get current date/time or convert between formats"
      parameters: {timezone?, format?}
```

---

## 3. Tool Selection Logic

### Decision Framework

```yaml
tool_selection:
  # INCLAW decides which tool to use based on:
  
  criteria:
    1. "Task requirements (what needs to be done?)"
    2. "Available tools (what tools are provided?)"
    3. "Efficiency (minimize tool calls)"
    4. "Accuracy (prefer precise tools over approximation)"
    
  training:
    # Train on examples of correct tool selection
    positive_examples:
      - user: "What's 234 × 567?"
        correct_tool: "calculator"
        wrong_tool: "Attempt mental math (error-prone)"
        
      - user: "Read the README file"
        correct_tool: "read_file"
        wrong_tool: "web_search (file is local)"
        
      - user: "Find all Python files with 'TODO'"
        correct_tool: "search_files"
        wrong_tool: "list_directory + read each file"
    
    negative_examples:
      - user: "What is 2 + 2?"
        wrong: "Using calculator tool (unnecessary overhead)"
        correct: "Answer directly: 4"
        
      - user: "Write a poem about nature"
        wrong: "Using any tool (this is a generation task)"
        correct: "Generate directly"
```

### When NOT to Use Tools

```yaml
no_tool_needed:
  - "Simple factual questions within training knowledge"
  - "Creative writing and brainstorming"
  - "Simple arithmetic (2+2, 10×5)"
  - "General knowledge questions"
  - "Opinion or analysis requests"
  - "Explaining concepts"
  
tool_preferred:
  - "Accessing specific files or data"
  - "Complex calculations"
  - "Current/real-time information"
  - "Executing code to verify results"
  - "Interacting with external systems"
  - "Any task requiring ground truth verification"
```

---

## 4. Multi-Step Tool Use

### Sequential Tool Chains

```
Example: "Summarize the pull request changes and run the tests"

Step 1: git_diff(ref1="main", ref2="HEAD")
  → Get list of changed files

Step 2: read_file(path="changed_file_1.py")
  → Understand the changes

Step 3: execute_code(language="bash", code="pytest tests/ -v")
  → Run the test suite

Step 4: Synthesize results into summary
  → Generate response combining diff analysis + test results
```

### Conditional Tool Use

```
Example: "Fix the failing test"

Step 1: execute_code(language="bash", code="pytest -x")
  → Run tests, find first failure

IF test fails:
  Step 2a: read_file(path="failing_test_file.py")
    → Read the test
  Step 3a: read_file(path="source_file.py")
    → Read the source code
  Step 4a: edit_file(path="source_file.py", ...)
    → Fix the code
  Step 5a: execute_code(language="bash", code="pytest -x")
    → Verify fix

ELSE:
  Step 2b: "All tests pass! No fix needed."
```

---

## 5. Training Data for Tool Use

### Datasets

| Dataset | Size | Description | Priority |
|---------|------|-------------|----------|
| Gorilla API Bench | 16.5K | API function calling | ⭐⭐⭐ |
| ToolBench | 126K | Massive multi-tool use | ⭐⭐⭐ |
| Glaive Function Calling v2 | 113K | Synthetic function calling | ⭐⭐⭐ |
| NexusRaven | 30K+ | Diverse function calling | ⭐⭐ |
| Agent-FLAN | 34K | Full agent trajectories | ⭐⭐⭐ |
| Custom SWE traces | Generated | Code editing trajectories | ⭐⭐⭐ |

### Training Format

```yaml
tool_use_training:
  format:
    system: |
      You are INCLAW. You have access to the following tools:
      {tool_definitions_json}
      
      When you need to use a tool, output a tool_call block.
      Wait for the tool_result before continuing.
      
    conversation:
      - role: user
        content: "Find all TODO comments in the src/ directory"
      - role: assistant
        content: |
          I'll search for TODO comments in the source directory.
          <tool_call>
          {"name": "search_files", "parameters": {"pattern": "TODO", "path": "src/"}}
          </tool_call>
      - role: tool
        content: |
          <tool_result>
          {"matches": [
            {"file": "src/main.py", "line": 42, "text": "# TODO: add error handling"},
            {"file": "src/utils.py", "line": 15, "text": "# TODO: optimize this loop"}
          ]}
          </tool_result>
      - role: assistant
        content: |
          I found 2 TODO comments in the src/ directory:
          1. **src/main.py:42** — "add error handling"
          2. **src/utils.py:15** — "optimize this loop"
```

---

## 6. Safety & Sandboxing

```yaml
safety:
  code_execution:
    sandbox: "Docker container with limited permissions"
    no_network: true              # By default
    no_file_system_escape: true   # Cannot access host filesystem
    timeout: 30                   # Seconds
    memory_limit: "512MB"
    
  file_operations:
    restricted_paths:
      - "/etc/"                   # System config
      - "/root/"                  # Root home
      - "~/.ssh/"                 # SSH keys
      - "~/.aws/"                 # Cloud credentials
    require_user_approval: 
      - "delete_file"             # Destructive operations
      - "write_file (new files)"  # Creating new files in sensitive directories
      
  web_tools:
    blocked_domains: "configurable blocklist"
    rate_limiting: "max 10 requests/minute"
    no_authentication: "Cannot use stored credentials"
```
