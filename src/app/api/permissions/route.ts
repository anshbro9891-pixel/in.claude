import { NextRequest, NextResponse } from "next/server";

/**
 * INCLAW Permissions API
 *
 * Manages user consent for agent actions.
 * The agent must request permission before accessing browser, terminal, etc.
 */

interface PermissionRequest {
  action: string;
  category: string;
  description: string;
  risk: "low" | "medium" | "high";
}

interface PermissionGrant {
  action: string;
  granted: boolean;
  sessionOnly?: boolean;
}

// In-memory permission store (per-session in production)
const permissionStore = new Map<string, Record<string, boolean>>();

export async function GET(request: NextRequest) {
  const sessionId = request.headers.get("x-session-id") || "default";
  const permissions = permissionStore.get(sessionId) || {};

  return NextResponse.json({ sessionId, permissions });
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.headers.get("x-session-id") || "default";
    const body: PermissionGrant = await request.json();
    const { action, granted } = body;

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    const permissions = permissionStore.get(sessionId) || {};
    permissions[action] = granted;
    permissionStore.set(sessionId, permissions);

    return NextResponse.json({
      message: `Permission ${granted ? "granted" : "denied"} for ${action}`,
      permissions,
    });
  } catch {
    return NextResponse.json({ error: "Failed to update permission" }, { status: 500 });
  }
}
