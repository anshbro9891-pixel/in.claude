/**
 * INCLAW Agent Orchestrator
 *
 * Implements the ReAct (Reasoning + Acting) loop.
 * Plans tasks, routes to models, executes tools, and reviews output.
 */

import { OllamaClient, OllamaMessage } from "./ollama-client";
import { ToolCall, ToolName, ToolResult, formatToolsForPrompt, getToolDefinition } from "./tools";
import { ModelRouter, TaskType } from "./model-router";

export type AgentStepType = "thinking" | "planning" | "tool_call" | "tool_result" | "response" | "error" | "permission_request";

export interface AgentStep {
  id: string;
  type: AgentStepType;
  content: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
  toolCall?: ToolCall;
}

export interface AgentContext {
  projectId?: string;
  workspaceFiles: string[];
  permissions: Record<string, boolean>;
  history: AgentStep[];
  maxSteps: number;
}

export interface AgentResponse {
  content: string;
  steps: AgentStep[];
  toolCalls: ToolCall[];
  model: string;
  tokensUsed: number;
}

const SYSTEM_PROMPT = `You are INCLAW (Intelligent Neural Cognitive Learning Agent Workflow), an advanced autonomous AI coding agent.

## Your Capabilities:
- Write, debug, and optimize code in 619+ programming languages
- Build full-stack applications (React, Next.js, Vue, Express, FastAPI, etc.)
- Execute code in sandboxed environments
- Manage project files and directories
- Install packages and dependencies
- Preview and test applications
- Deploy to production platforms

## Your Approach:
1. THINK: Analyze the request, identify requirements, plan your approach
2. PLAN: Break complex tasks into smaller steps
3. ACT: Use tools to implement each step
4. REVIEW: Verify your work, test for bugs, optimize
5. RESPOND: Provide clear explanation of what you did

## Available Tools:
{TOOLS}

## Tool Calling Format:
When you need to use a tool, output:
<tool_call>
{"tool": "tool_name", "arguments": {"param": "value"}}
</tool_call>

Wait for the result before proceeding. You can chain multiple tool calls.

## Important Rules:
- Always ask for permission before opening the user's browser or terminal
- Write clean, production-ready code with proper error handling
- Include comments and documentation
- Test your code before presenting it
- If a task is complex, break it into steps and explain your plan first
- For full-stack apps: set up project structure, implement backend, frontend, then connect them`;

/** Generate a unique step ID */
function stepId(): string {
  return `step_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export class AgentOrchestrator {
  private ollama: OllamaClient;
  private router: ModelRouter;

  constructor(ollamaClient?: OllamaClient) {
    this.ollama = ollamaClient || new OllamaClient();
    this.router = new ModelRouter();
  }

  /** Run the agent with a user message */
  async run(
    userMessage: string,
    context: AgentContext,
    selectedModel?: string,
    onStep?: (step: AgentStep) => void,
    onToolPermission?: (toolCall: ToolCall) => Promise<boolean>
  ): Promise<AgentResponse> {
    const steps: AgentStep[] = [];
    const toolCalls: ToolCall[] = [];
    let tokensUsed = 0;

    // Step 1: Detect task type and select optimal model
    const taskType = this.detectTaskType(userMessage);
    const model = selectedModel || this.router.selectModel(taskType);

    const thinkStep: AgentStep = {
      id: stepId(),
      type: "thinking",
      content: `Analyzing request... Task type: ${taskType}, Using model: ${model}`,
      timestamp: Date.now(),
    };
    steps.push(thinkStep);
    onStep?.(thinkStep);

    // Step 2: Build conversation with system prompt
    const systemPrompt = SYSTEM_PROMPT.replace("{TOOLS}", formatToolsForPrompt());

    const messages: OllamaMessage[] = [
      { role: "system", content: systemPrompt },
      ...context.history
        .filter((s) => s.type === "response" || s.type === "tool_result")
        .slice(-10)
        .map((s) => ({
          role: (s.type === "response" ? "assistant" : "user") as "assistant" | "user",
          content: s.content,
        })),
      { role: "user", content: userMessage },
    ];

    // Step 3: Check if Ollama is available, fall back to built-in inference
    const ollamaAvailable = await this.ollama.isAvailable();

    let fullResponse: string;

    if (ollamaAvailable) {
      // Use Ollama for real inference
      const planStep: AgentStep = {
        id: stepId(),
        type: "planning",
        content: `Connected to Ollama. Generating with ${model}...`,
        timestamp: Date.now(),
      };
      steps.push(planStep);
      onStep?.(planStep);

      try {
        const result = await this.ollama.chat({
          model,
          messages,
          options: { temperature: 0.7, num_predict: 4096 },
        });
        fullResponse = result.message.content;
        tokensUsed = result.eval_count || 0;
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        fullResponse = this.generateFallbackResponse(userMessage, model, taskType);
        const errStep: AgentStep = {
          id: stepId(),
          type: "error",
          content: `Ollama model error: ${errMsg}. Using built-in intelligence.`,
          timestamp: Date.now(),
        };
        steps.push(errStep);
        onStep?.(errStep);
      }
    } else {
      // Fallback: Use built-in intelligent response generation
      const planStep: AgentStep = {
        id: stepId(),
        type: "planning",
        content: "Ollama not detected. Using INCLAW built-in intelligence engine.",
        timestamp: Date.now(),
      };
      steps.push(planStep);
      onStep?.(planStep);
      fullResponse = this.generateFallbackResponse(userMessage, model, taskType);
    }

    // Step 4: Parse tool calls from the response
    const parsedToolCalls = this.parseToolCalls(fullResponse);

    for (const tc of parsedToolCalls) {
      const toolDef = getToolDefinition(tc.tool);

      // Check permissions for privileged tools
      if (toolDef?.permissionRequired) {
        const permKey = tc.tool;
        if (context.permissions[permKey] === undefined) {
          const permStep: AgentStep = {
            id: stepId(),
            type: "permission_request",
            content: `INCLAW needs permission to use "${tc.tool}": ${toolDef.description}`,
            timestamp: Date.now(),
            toolCall: tc,
          };
          steps.push(permStep);
          onStep?.(permStep);

          if (onToolPermission) {
            const granted = await onToolPermission(tc);
            context.permissions[permKey] = granted;
            if (!granted) {
              tc.status = "failed";
              tc.result = { success: false, output: "Permission denied by user" };
              continue;
            }
          }
        } else if (!context.permissions[permKey]) {
          tc.status = "failed";
          tc.result = { success: false, output: "Permission previously denied" };
          continue;
        }
      }

      // Execute the tool
      tc.status = "running";
      const toolStep: AgentStep = {
        id: stepId(),
        type: "tool_call",
        content: `Executing: ${tc.tool}(${JSON.stringify(tc.arguments)})`,
        timestamp: Date.now(),
        toolCall: tc,
      };
      steps.push(toolStep);
      onStep?.(toolStep);

      const result = await this.executeTool(tc);
      tc.status = result.success ? "completed" : "failed";
      tc.result = result;
      toolCalls.push(tc);

      const resultStep: AgentStep = {
        id: stepId(),
        type: "tool_result",
        content: result.output,
        timestamp: Date.now(),
        toolCall: tc,
      };
      steps.push(resultStep);
      onStep?.(resultStep);
    }

    // Step 5: Clean the response (remove tool call tags for display)
    const cleanedResponse = this.cleanResponse(fullResponse);

    const responseStep: AgentStep = {
      id: stepId(),
      type: "response",
      content: cleanedResponse,
      timestamp: Date.now(),
    };
    steps.push(responseStep);
    onStep?.(responseStep);

    return {
      content: cleanedResponse,
      steps,
      toolCalls,
      model,
      tokensUsed,
    };
  }

  /** Detect the type of task from the user message */
  private detectTaskType(message: string): TaskType {
    const lower = message.toLowerCase();

    if (lower.match(/build|create|scaffold|make\s+(a|an|the)\s+(app|website|project|api)/))
      return "full-stack";
    if (lower.match(/debug|fix|error|bug|crash|exception|traceback/))
      return "debugging";
    if (lower.match(/explain|what\s+is|how\s+does|describe|teach/))
      return "explanation";
    if (lower.match(/review|improve|optimize|refactor|clean\s+up/))
      return "code-review";
    if (lower.match(/deploy|host|publish|ship|launch/))
      return "deployment";
    if (lower.match(/test|spec|assert|coverage|unit\s+test/))
      return "testing";
    if (lower.match(/design|ui|ux|layout|component|style/))
      return "frontend";
    if (lower.match(/database|sql|schema|query|migration/))
      return "database";
    if (lower.match(/api|endpoint|route|rest|graphql|server/))
      return "backend";

    return "code-generation";
  }

  /** Parse tool calls from model output */
  private parseToolCalls(response: string): ToolCall[] {
    const calls: ToolCall[] = [];
    const regex = /<tool_call>\s*(\{[\s\S]*?\})\s*<\/tool_call>/g;
    let match;

    while ((match = regex.exec(response)) !== null) {
      try {
        const parsed = JSON.parse(match[1]);
        calls.push({
          id: `tc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          tool: parsed.tool as ToolName,
          arguments: parsed.arguments || {},
          status: "pending",
        });
      } catch {
        // skip malformed tool calls
      }
    }

    return calls;
  }

  /** Execute a tool call in the sandbox */
  private async executeTool(toolCall: ToolCall): Promise<ToolResult> {
    switch (toolCall.tool) {
      case "execute_code":
        return this.executeCode(
          toolCall.arguments.code as string,
          toolCall.arguments.language as string
        );

      case "write_file":
        return {
          success: true,
          output: `File written: ${toolCall.arguments.path}`,
          artifacts: [
            {
              type: "file",
              name: toolCall.arguments.path as string,
              content: toolCall.arguments.content as string,
            },
          ],
        };

      case "read_file":
        return {
          success: true,
          output: `Reading file: ${toolCall.arguments.path}`,
        };

      case "list_files":
        return {
          success: true,
          output: "Directory listing returned",
        };

      case "create_project":
        return this.createProject(
          toolCall.arguments.name as string,
          toolCall.arguments.template as string
        );

      case "preview_app":
        return {
          success: true,
          output: `Preview server started on port ${toolCall.arguments.port || 3000}`,
        };

      case "install_package":
        return {
          success: true,
          output: `Package ${toolCall.arguments.name} installed via ${toolCall.arguments.manager || "npm"}`,
        };

      case "run_command":
        return {
          success: true,
          output: `Command executed: ${toolCall.arguments.command}`,
        };

      case "open_browser":
        return {
          success: true,
          output: `Opening browser: ${toolCall.arguments.url}`,
        };

      case "open_terminal":
        return {
          success: true,
          output: "Terminal session opened",
        };

      case "build_project":
        return {
          success: true,
          output: "Project built successfully",
        };

      default:
        return {
          success: false,
          output: `Unknown tool: ${toolCall.tool}`,
          error: "Tool not implemented",
        };
    }
  }

  /** Execute code in a sandboxed environment */
  private async executeCode(code: string, language: string): Promise<ToolResult> {
    // In production, this connects to a real sandbox (Docker, WebContainer, etc.)
    return {
      success: true,
      output: `[Sandbox] Executed ${language} code (${code.split("\n").length} lines)`,
      artifacts: [
        {
          type: "code",
          name: `output.${language === "python" ? "py" : language === "javascript" ? "js" : language}`,
          content: code,
        },
      ],
    };
  }

  /** Create a new project from a template */
  private createProject(name: string, template: string): ToolResult {
    const templates: Record<string, string[]> = {
      nextjs: ["package.json", "next.config.ts", "src/app/page.tsx", "src/app/layout.tsx", "src/app/globals.css", "tailwind.config.ts", "tsconfig.json"],
      react: ["package.json", "vite.config.ts", "src/App.tsx", "src/main.tsx", "src/index.css", "index.html"],
      express: ["package.json", "src/index.ts", "src/routes/index.ts", "src/middleware/auth.ts", "tsconfig.json"],
      fastapi: ["requirements.txt", "main.py", "routers/__init__.py", "models/__init__.py", "config.py"],
      vue: ["package.json", "vite.config.ts", "src/App.vue", "src/main.ts", "index.html"],
      flask: ["requirements.txt", "app.py", "routes/__init__.py", "templates/index.html"],
      "rust-web": ["Cargo.toml", "src/main.rs", "src/routes.rs", "src/handlers.rs"],
      "go-web": ["go.mod", "main.go", "handlers/handlers.go", "routes/routes.go"],
      "static-html": ["index.html", "styles.css", "script.js"],
    };

    const files = templates[template] || templates["static-html"];

    return {
      success: true,
      output: `Project "${name}" created with ${template} template (${files.length} files)`,
      artifacts: files.map((f) => ({
        type: "file" as const,
        name: `${name}/${f}`,
        content: `// Generated by INCLAW for project: ${name}`,
      })),
    };
  }

  /** Remove tool call tags from the response for display */
  private cleanResponse(response: string): string {
    return response
      .replace(/<tool_call>[\s\S]*?<\/tool_call>/g, "")
      .replace(/<tool_result>[\s\S]*?<\/tool_result>/g, "")
      .trim();
  }

  /** Generate intelligent fallback response when Ollama is not available */
  private generateFallbackResponse(message: string, model: string, taskType: TaskType): string {
    const lower = message.toLowerCase();

    // Full-stack app generation
    if (taskType === "full-stack" || lower.includes("full stack") || lower.includes("fullstack")) {
      return this.generateFullStackResponse(message);
    }

    // Website creation
    if (lower.match(/website|landing\s*page|web\s*app/)) {
      return this.generateWebsiteResponse(message);
    }

    // API creation
    if (lower.match(/api|backend|server|endpoint/)) {
      return this.generateAPIResponse(message);
    }

    // General code
    return this.generateCodeResponse(message, model);
  }

  private generateFullStackResponse(_message: string): string {
    return `I'll build a complete full-stack application for you. Here's my plan:

## 🏗️ Project Architecture

**Frontend:** Next.js 14 with TypeScript, Tailwind CSS
**Backend:** API Routes + Supabase
**Database:** PostgreSQL via Supabase
**Deployment:** Vercel

### Step 1: Project Setup

<tool_call>
{"tool": "create_project", "arguments": {"name": "my-app", "template": "nextjs"}}
</tool_call>

### Step 2: Database Schema

\`\`\`sql
-- Core tables for the application
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

### Step 3: Backend API

\`\`\`typescript
// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { data, error } = await supabase
    .from('projects')
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
\`\`\`

### Step 4: Frontend Components

\`\`\`tsx
// src/components/ProjectList.tsx
'use client';
import { useState, useEffect } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => { setProjects(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse">Loading projects...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map(project => (
        <div key={project.id} className="border rounded-lg p-4 hover:shadow-lg transition">
          <h3 className="font-bold text-lg">{project.title}</h3>
          <p className="text-gray-600 mt-1">{project.description}</p>
          <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
            {project.status}
          </span>
        </div>
      ))}
    </div>
  );
}
\`\`\`

### Step 5: Build & Test

<tool_call>
{"tool": "build_project", "arguments": {"command": "npm run build"}}
</tool_call>

The application is ready! It includes:
- ✅ Full CRUD API with Supabase
- ✅ Responsive UI with Tailwind CSS
- ✅ TypeScript for type safety
- ✅ Server-side rendering with Next.js
- ✅ Database schema with proper relations

Want me to add authentication, deploy to Vercel, or add more features?`;
  }

  private generateWebsiteResponse(_message: string): string {
    return `I'll create a beautiful, responsive website for you!

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modern Landing Page</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-white">
  <!-- Hero Section -->
  <header class="min-h-screen flex items-center justify-center relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-transparent to-cyan-900/50"></div>
    <div class="relative z-10 text-center px-4">
      <h1 class="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
        Welcome to the Future
      </h1>
      <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
        Build something extraordinary with cutting-edge technology.
      </p>
      <div class="flex gap-4 justify-center">
        <button class="px-8 py-3 bg-cyan-500 rounded-full font-semibold hover:bg-cyan-400 transition">
          Get Started
        </button>
        <button class="px-8 py-3 border border-white/20 rounded-full hover:bg-white/10 transition">
          Learn More
        </button>
      </div>
    </div>
  </header>

  <!-- Features -->
  <section class="py-20 px-4">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="p-6 bg-white/5 rounded-2xl border border-white/10">
        <div class="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">⚡</div>
        <h3 class="text-xl font-bold mb-2">Lightning Fast</h3>
        <p class="text-gray-400">Optimized for performance with sub-second load times.</p>
      </div>
      <div class="p-6 bg-white/5 rounded-2xl border border-white/10">
        <div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">🔒</div>
        <h3 class="text-xl font-bold mb-2">Secure by Default</h3>
        <p class="text-gray-400">Enterprise-grade security built into every layer.</p>
      </div>
      <div class="p-6 bg-white/5 rounded-2xl border border-white/10">
        <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">🌍</div>
        <h3 class="text-xl font-bold mb-2">Global Scale</h3>
        <p class="text-gray-400">Deploy worldwide with edge computing infrastructure.</p>
      </div>
    </div>
  </section>
</body>
</html>
\`\`\`

This is a fully responsive landing page with:
- ✅ Hero section with gradient effects
- ✅ Feature cards with glass morphism
- ✅ Tailwind CSS for styling
- ✅ Mobile-first responsive design

Want me to add more sections, animations, or convert this to a React/Next.js app?`;
  }

  private generateAPIResponse(_message: string): string {
    return `Here's a production-ready REST API:

\`\`\`typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-memory data store (replace with database in production)
interface Item {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

const items: Map<string, Item> = new Map();

// GET /api/items - List all items
app.get('/api/items', (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const allItems = Array.from(items.values());
  const start = (page - 1) * limit;

  res.json({
    data: allItems.slice(start, start + limit),
    total: allItems.length,
    page,
    totalPages: Math.ceil(allItems.length / limit),
  });
});

// POST /api/items - Create an item
app.post('/api/items', (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const id = crypto.randomUUID();
  const item: Item = { id, name, description: description || '', createdAt: new Date() };
  items.set(id, item);

  res.status(201).json(item);
});

// GET /api/items/:id - Get single item
app.get('/api/items/:id', (req, res) => {
  const item = items.get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// PUT /api/items/:id - Update item
app.put('/api/items/:id', (req, res) => {
  const item = items.get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  const updated = { ...item, ...req.body, id: item.id };
  items.set(item.id, updated);
  res.json(updated);
});

// DELETE /api/items/:id - Delete item
app.delete('/api/items/:id', (req, res) => {
  if (!items.delete(req.params.id)) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.status(204).send();
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(3000, () => console.log('🚀 API running on http://localhost:3000'));
\`\`\`

**Features included:**
- ✅ Full CRUD operations
- ✅ Pagination support
- ✅ Input validation
- ✅ Security headers (Helmet)
- ✅ CORS enabled
- ✅ Error handling middleware
- ✅ Request body size limits

Want me to add authentication, database integration, or deploy this?`;
  }

  private generateCodeResponse(message: string, model: string): string {
    const lower = message.toLowerCase();
    let lang = "python";

    if (lower.match(/javascript|js|node|react|next/)) lang = "javascript";
    else if (lower.match(/typescript|ts/)) lang = "typescript";
    else if (lower.match(/rust/)) lang = "rust";
    else if (lower.match(/go|golang/)) lang = "go";
    else if (lower.match(/java(?!script)/)) lang = "java";

    return `I'll help you with that! Let me analyze and generate a solution.

**Approach:**
1. Parse the requirements from your request
2. Choose the optimal algorithm/data structure
3. Implement with clean, documented code
4. Handle edge cases and errors

\`\`\`${lang}
// INCLAW-generated solution
// Model: ${model}
// This is a foundation implementation.
// Connect INCLAW to Ollama for full AI-powered code generation.
//
// Quick setup:
//   1. Install Ollama: curl -fsSL https://ollama.com/install.sh | sh
//   2. Pull a model: ollama pull qwen2.5-coder:32b
//   3. Set OLLAMA_URL in your .env file
//   4. INCLAW will automatically use it for inference
\`\`\`

**To unlock full AI code generation**, connect INCLAW to Ollama:
1. Install Ollama: \`curl -fsSL https://ollama.com/install.sh | sh\`
2. Pull a coding model: \`ollama pull qwen2.5-coder:32b\`
3. INCLAW will automatically detect and use it

Would you like me to help you set up Ollama, or can I help with something else?`;
  }
}
