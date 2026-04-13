/**
 * INCLAW Tool Framework
 *
 * Defines tools the agent can use: code execution, file system,
 * browser control, terminal access — all permission-gated.
 */

export type ToolName =
  | "execute_code"
  | "read_file"
  | "write_file"
  | "list_files"
  | "create_directory"
  | "delete_file"
  | "open_browser"
  | "open_terminal"
  | "run_command"
  | "search_web"
  | "install_package"
  | "preview_app"
  | "create_project"
  | "build_project"
  | "deploy_project";

export type PermissionLevel = "granted" | "denied" | "ask";

export interface ToolDefinition {
  name: ToolName;
  description: string;
  category: "code" | "filesystem" | "browser" | "terminal" | "project";
  permissionRequired: boolean;
  parameters: ToolParameter[];
}

export interface ToolParameter {
  name: string;
  type: "string" | "number" | "boolean" | "object";
  description: string;
  required: boolean;
  enum?: string[];
}

export interface ToolCall {
  id: string;
  tool: ToolName;
  arguments: Record<string, unknown>;
  status: "pending" | "running" | "completed" | "failed" | "permission_required";
  result?: ToolResult;
}

export interface ToolResult {
  success: boolean;
  output: string;
  error?: string;
  artifacts?: ToolArtifact[];
}

export interface ToolArtifact {
  type: "file" | "url" | "image" | "code";
  name: string;
  content: string;
  mimeType?: string;
}

/** All available tools with their schemas */
export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: "execute_code",
    description: "Execute code in a sandboxed environment. Supports Python, JavaScript, TypeScript, Go, Rust, and more.",
    category: "code",
    permissionRequired: false,
    parameters: [
      { name: "code", type: "string", description: "The code to execute", required: true },
      { name: "language", type: "string", description: "Programming language", required: true, enum: ["python", "javascript", "typescript", "go", "rust", "java", "ruby", "php", "shell"] },
      { name: "timeout", type: "number", description: "Execution timeout in seconds", required: false },
    ],
  },
  {
    name: "read_file",
    description: "Read contents of a file in the workspace",
    category: "filesystem",
    permissionRequired: false,
    parameters: [
      { name: "path", type: "string", description: "Relative path to the file", required: true },
    ],
  },
  {
    name: "write_file",
    description: "Create or overwrite a file in the workspace",
    category: "filesystem",
    permissionRequired: false,
    parameters: [
      { name: "path", type: "string", description: "Relative path for the file", required: true },
      { name: "content", type: "string", description: "File content to write", required: true },
    ],
  },
  {
    name: "list_files",
    description: "List files and directories in a workspace path",
    category: "filesystem",
    permissionRequired: false,
    parameters: [
      { name: "path", type: "string", description: "Directory path to list", required: false },
    ],
  },
  {
    name: "create_directory",
    description: "Create a new directory in the workspace",
    category: "filesystem",
    permissionRequired: false,
    parameters: [
      { name: "path", type: "string", description: "Directory path to create", required: true },
    ],
  },
  {
    name: "delete_file",
    description: "Delete a file or directory from the workspace",
    category: "filesystem",
    permissionRequired: true,
    parameters: [
      { name: "path", type: "string", description: "Path to delete", required: true },
    ],
  },
  {
    name: "open_browser",
    description: "Open a URL in the user's browser (requires permission)",
    category: "browser",
    permissionRequired: true,
    parameters: [
      { name: "url", type: "string", description: "URL to open", required: true },
    ],
  },
  {
    name: "open_terminal",
    description: "Open a terminal session for the user (requires permission)",
    category: "terminal",
    permissionRequired: true,
    parameters: [
      { name: "command", type: "string", description: "Initial command to run", required: false },
      { name: "cwd", type: "string", description: "Working directory", required: false },
    ],
  },
  {
    name: "run_command",
    description: "Run a shell command in the sandbox",
    category: "terminal",
    permissionRequired: true,
    parameters: [
      { name: "command", type: "string", description: "Shell command to execute", required: true },
      { name: "cwd", type: "string", description: "Working directory", required: false },
      { name: "timeout", type: "number", description: "Timeout in seconds", required: false },
    ],
  },
  {
    name: "search_web",
    description: "Search the web for information",
    category: "browser",
    permissionRequired: true,
    parameters: [
      { name: "query", type: "string", description: "Search query", required: true },
    ],
  },
  {
    name: "install_package",
    description: "Install a package/dependency in the project",
    category: "project",
    permissionRequired: true,
    parameters: [
      { name: "name", type: "string", description: "Package name", required: true },
      { name: "manager", type: "string", description: "Package manager to use", required: false, enum: ["npm", "pip", "cargo", "go"] },
    ],
  },
  {
    name: "preview_app",
    description: "Start a development server and preview the application",
    category: "project",
    permissionRequired: false,
    parameters: [
      { name: "port", type: "number", description: "Port to serve on", required: false },
      { name: "command", type: "string", description: "Custom start command", required: false },
    ],
  },
  {
    name: "create_project",
    description: "Scaffold a new project from a template",
    category: "project",
    permissionRequired: false,
    parameters: [
      { name: "name", type: "string", description: "Project name", required: true },
      { name: "template", type: "string", description: "Project template", required: true, enum: ["nextjs", "react", "vue", "express", "fastapi", "flask", "rust-web", "go-web", "static-html"] },
      { name: "features", type: "object", description: "Additional features to include", required: false },
    ],
  },
  {
    name: "build_project",
    description: "Build the project for production deployment",
    category: "project",
    permissionRequired: false,
    parameters: [
      { name: "command", type: "string", description: "Custom build command", required: false },
    ],
  },
  {
    name: "deploy_project",
    description: "Deploy the project to a hosting platform",
    category: "project",
    permissionRequired: true,
    parameters: [
      { name: "platform", type: "string", description: "Deployment target", required: true, enum: ["vercel", "netlify", "cloudflare", "docker"] },
    ],
  },
];

/** Get a tool definition by name */
export function getToolDefinition(name: ToolName): ToolDefinition | undefined {
  return TOOL_DEFINITIONS.find((t) => t.name === name);
}

/** Format tool definitions for the agent system prompt */
export function formatToolsForPrompt(): string {
  return TOOL_DEFINITIONS.map(
    (t) =>
      `<tool name="${t.name}" category="${t.category}" permission="${t.permissionRequired ? "required" : "auto"}">
  ${t.description}
  Parameters: ${t.parameters.map((p) => `${p.name}(${p.type}${p.required ? ", required" : ""}): ${p.description}`).join("; ")}
</tool>`
  ).join("\n");
}
