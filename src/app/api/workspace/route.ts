import { NextRequest, NextResponse } from "next/server";
import { PROJECT_TEMPLATES } from "@/lib/agent/sandbox";

/**
 * INCLAW Workspace API
 *
 * Manages project workspaces for the app builder.
 * Handles project creation, file management, and build operations.
 */

interface CreateWorkspaceRequest {
  name: string;
  template: string;
}

interface UpdateFileRequest {
  path: string;
  content: string;
}

// In-memory workspace store (use Supabase/Redis in production)
const workspaces = new Map<string, {
  id: string;
  name: string;
  template: string;
  files: Record<string, string>;
  status: string;
  createdAt: number;
}>();

export async function GET() {
  const list = Array.from(workspaces.values()).map((w) => ({
    id: w.id,
    name: w.name,
    template: w.template,
    fileCount: Object.keys(w.files).length,
    status: w.status,
    createdAt: w.createdAt,
  }));

  return NextResponse.json({ workspaces: list });
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateWorkspaceRequest = await request.json();
    const { name, template } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!template || !PROJECT_TEMPLATES[template]) {
      return NextResponse.json(
        { error: `Invalid template. Available: ${Object.keys(PROJECT_TEMPLATES).join(", ")}` },
        { status: 400 }
      );
    }

    const id = `ws_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const tmpl = PROJECT_TEMPLATES[template];
    const files: Record<string, string> = {};

    for (const file of tmpl.files) {
      files[file.path] = file.content;
    }

    const workspace = {
      id,
      name: name.trim(),
      template,
      files,
      status: "ready",
      createdAt: Date.now(),
    };

    workspaces.set(id, workspace);

    return NextResponse.json({
      id: workspace.id,
      name: workspace.name,
      template: workspace.template,
      files: Object.entries(files).map(([path, content]) => ({
        path,
        size: content.length,
      })),
      status: workspace.status,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create workspace" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: UpdateFileRequest & { workspaceId: string } = await request.json();
    const { workspaceId, path, content } = body;

    const workspace = workspaces.get(workspaceId);
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    workspace.files[path] = content;

    return NextResponse.json({
      message: `File ${path} updated`,
      size: content.length,
    });
  } catch {
    return NextResponse.json({ error: "Failed to update file" }, { status: 500 });
  }
}
