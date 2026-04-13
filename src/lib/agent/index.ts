/**
 * INCLAW Agent System - Barrel Export
 *
 * The complete agentic AI engine combining:
 * - Ollama integration for multi-model inference
 * - ReAct agent orchestrator with planning and reasoning
 * - Tool framework for code execution, file management, browser, terminal
 * - Intelligent model routing for task-specific optimization
 * - Sandboxed code execution environment
 * - Permission system for user-consented actions
 */

export { OllamaClient, ollama } from "./ollama-client";
export type { OllamaMessage, OllamaGenerateRequest, OllamaGenerateResponse, OllamaModel } from "./ollama-client";

export { AgentOrchestrator } from "./orchestrator";
export type { AgentStep, AgentStepType, AgentContext, AgentResponse } from "./orchestrator";

export { ModelRouter, modelRouter } from "./model-router";
export type { TaskType } from "./model-router";

export { TOOL_DEFINITIONS, getToolDefinition, formatToolsForPrompt } from "./tools";
export type { ToolName, ToolDefinition, ToolCall, ToolResult, ToolArtifact, PermissionLevel } from "./tools";

export {
  PROJECT_TEMPLATES,
  createSandboxProject,
  updateProjectFile,
  deleteProjectFile,
} from "./sandbox";
export type { SandboxFile, SandboxProject, ExecutionResult, PreviewConfig } from "./sandbox";

export {
  createPermissionState,
  createPermissionRequest,
  TOOL_PERMISSION_MAP,
  getRiskColor,
  getRiskIcon,
} from "./permissions";
export type { PermissionCategory, PermissionRequest, PermissionState } from "./permissions";
