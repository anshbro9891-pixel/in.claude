"use client";

import { useState } from "react";
import {
  FolderOpen,
  File,
  ChevronRight,
  ChevronDown,
  FilePlus,
  FolderPlus,
  Trash2,
  FileCode,
  FileText,
  FileJson,
  Image,
} from "lucide-react";

export interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileTreeNode[];
  language?: string;
}

interface FileExplorerProps {
  files: FileTreeNode[];
  selectedFile?: string;
  onSelectFile: (path: string) => void;
  onCreateFile?: (path: string) => void;
  onDeleteFile?: (path: string) => void;
}

const FILE_ICONS: Record<string, React.ElementType> = {
  ts: FileCode,
  tsx: FileCode,
  js: FileCode,
  jsx: FileCode,
  py: FileCode,
  rs: FileCode,
  go: FileCode,
  json: FileJson,
  md: FileText,
  txt: FileText,
  html: FileCode,
  css: FileCode,
  svg: Image,
  png: Image,
  jpg: Image,
};

function getFileColor(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const colors: Record<string, string> = {
    ts: "text-blue-400",
    tsx: "text-blue-400",
    js: "text-yellow-400",
    jsx: "text-yellow-400",
    py: "text-green-400",
    rs: "text-orange-400",
    go: "text-cyan-400",
    json: "text-yellow-500",
    md: "text-slate-400",
    html: "text-orange-400",
    css: "text-purple-400",
    sql: "text-blue-300",
  };
  return colors[ext] || "text-slate-400";
}

function FileNode({
  node,
  depth,
  selectedFile,
  onSelectFile,
  onDeleteFile,
}: {
  node: FileTreeNode;
  depth: number;
  selectedFile?: string;
  onSelectFile: (path: string) => void;
  onDeleteFile?: (path: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const isDirectory = node.type === "directory";
  const isSelected = selectedFile === node.path;
  const iconColor = isDirectory ? "text-cyan-400" : getFileColor(node.name);

  // Get the icon component at the module level to avoid creating during render
  const fileIconKey = node.name.split(".").pop()?.toLowerCase() || "";
  const FileIconComponent = isDirectory ? FolderOpen : (FILE_ICONS[fileIconKey] || File);

  return (
    <div>
      <div
        className={`group flex items-center gap-1.5 rounded-md px-2 py-1 cursor-pointer transition text-sm ${
          isSelected
            ? "bg-cyan-500/10 text-white"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (isDirectory) {
            setIsOpen(!isOpen);
          } else {
            onSelectFile(node.path);
          }
        }}
      >
        {isDirectory && (
          <span className="text-slate-600">
            {isOpen ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </span>
        )}
        {!isDirectory && <span className="w-3.5" />}
        <FileIconComponent className={`h-4 w-4 shrink-0 ${iconColor}`} />
        <span className="truncate">{node.name}</span>

        {onDeleteFile && !isDirectory && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteFile(node.path);
            }}
            className="ml-auto hidden group-hover:block p-0.5 text-slate-600 hover:text-red-400 transition"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>

      {isDirectory && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileNode
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedFile={selectedFile}
              onSelectFile={onSelectFile}
              onDeleteFile={onDeleteFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileExplorer({
  files,
  selectedFile,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
}: FileExplorerProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Explorer
        </span>
        <div className="flex items-center gap-1">
          {onCreateFile && (
            <>
              <button
                onClick={() => onCreateFile("untitled.ts")}
                className="p-1 text-slate-600 hover:text-white transition"
                title="New File"
              >
                <FilePlus className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onCreateFile("new-folder/")}
                className="p-1 text-slate-600 hover:text-white transition"
                title="New Folder"
              >
                <FolderPlus className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {files.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-600">
            No files yet. Create a project to get started.
          </div>
        ) : (
          files.map((node) => (
            <FileNode
              key={node.path}
              node={node}
              depth={0}
              selectedFile={selectedFile}
              onSelectFile={onSelectFile}
              onDeleteFile={onDeleteFile}
            />
          ))
        )}
      </div>
    </div>
  );
}

/** Convert flat file paths to a tree structure */
export function buildFileTree(paths: string[]): FileTreeNode[] {
  const root: FileTreeNode[] = [];

  for (const filePath of paths) {
    const parts = filePath.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const path = parts.slice(0, i + 1).join("/");
      const isLast = i === parts.length - 1;

      const existing = current.find((n) => n.name === name);

      if (existing) {
        if (existing.children) {
          current = existing.children;
        }
      } else {
        const node: FileTreeNode = {
          name,
          path,
          type: isLast ? "file" : "directory",
          children: isLast ? undefined : [],
        };
        current.push(node);
        if (node.children) {
          current = node.children;
        }
      }
    }
  }

  // Sort: directories first, then alphabetically
  const sortTree = (nodes: FileTreeNode[]): FileTreeNode[] => {
    return nodes
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
      .map((n) => ({
        ...n,
        children: n.children ? sortTree(n.children) : undefined,
      }));
  };

  return sortTree(root);
}
