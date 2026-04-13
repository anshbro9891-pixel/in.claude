/**
 * INCLAW Permission System
 *
 * Manages user consent for sensitive agent actions.
 * INCLAW always asks before accessing browser, terminal, or user resources.
 */

export type PermissionCategory = "browser" | "terminal" | "filesystem" | "network" | "deployment";

export interface PermissionRequest {
  id: string;
  category: PermissionCategory;
  action: string;
  description: string;
  risk: "low" | "medium" | "high";
  timestamp: number;
  status: "pending" | "granted" | "denied";
}

export interface PermissionState {
  requests: PermissionRequest[];
  grants: Record<string, boolean>;
  sessionGrants: Set<string>;
}

/** Create initial permission state */
export function createPermissionState(): PermissionState {
  return {
    requests: [],
    grants: {},
    sessionGrants: new Set(),
  };
}

/** Create a permission request */
export function createPermissionRequest(
  category: PermissionCategory,
  action: string,
  description: string,
  risk: "low" | "medium" | "high" = "medium"
): PermissionRequest {
  return {
    id: `perm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    category,
    action,
    description,
    risk,
    timestamp: Date.now(),
    status: "pending",
  };
}

/** Map tool names to permission categories */
export const TOOL_PERMISSION_MAP: Record<string, { category: PermissionCategory; risk: "low" | "medium" | "high"; description: string }> = {
  open_browser: {
    category: "browser",
    risk: "medium",
    description: "Open a URL in your browser",
  },
  open_terminal: {
    category: "terminal",
    risk: "high",
    description: "Open a terminal session on your system",
  },
  run_command: {
    category: "terminal",
    risk: "high",
    description: "Execute a shell command",
  },
  delete_file: {
    category: "filesystem",
    risk: "medium",
    description: "Delete a file from the workspace",
  },
  search_web: {
    category: "network",
    risk: "low",
    description: "Search the web for information",
  },
  install_package: {
    category: "terminal",
    risk: "medium",
    description: "Install a package/dependency",
  },
  deploy_project: {
    category: "deployment",
    risk: "high",
    description: "Deploy the project to a hosting platform",
  },
};

/** Get risk level color for UI display */
export function getRiskColor(risk: "low" | "medium" | "high"): string {
  switch (risk) {
    case "low": return "text-green-400";
    case "medium": return "text-yellow-400";
    case "high": return "text-red-400";
  }
}

/** Get risk level icon */
export function getRiskIcon(risk: "low" | "medium" | "high"): string {
  switch (risk) {
    case "low": return "🟢";
    case "medium": return "🟡";
    case "high": return "🔴";
  }
}
