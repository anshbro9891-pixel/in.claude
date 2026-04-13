import { callINCLAW } from './puter-backend.js';

let editor;
let files = createInitialFiles();

/**
 * Returns a fresh default file map for each workspace initialization.
 */
function createInitialFiles() {
  return {
    'index.html': '<h1>Hello INCLAW</h1>',
    'style.css': 'body { font-family: sans-serif; }',
    'script.js': 'console.log("INCLAW ready")'
  };
}

/**
 * Boots Monaco editor, explorer actions, and AI assistant in workspace.
 */
export function initWorkspace() {
  try {
    files = createInitialFiles();
    initMonaco();
    bindFiles();
    bindTemplates();
    bindAiActions();
  } catch (error) {
    console.error('[INCLAW] workspace init failed', error);
  }
}

/**
 * Initializes Monaco via AMD loader from CDN.
 */
function initMonaco() {
  try {
    window.require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
    window.require(['vs/editor/editor.main'], () => {
      editor = monaco.editor.create(document.getElementById('editor'), {
        value: files['index.html'],
        language: 'html',
        theme: 'vs-dark',
        minimap: { enabled: true },
        automaticLayout: true
      });

      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
        const prompt = promptInline();
        if (prompt) askInline(prompt);
      });

      editor.addAction({
        id: 'ask-inclaw',
        label: 'Ask INCLAW',
        contextMenuGroupId: 'navigation',
        run: () => {
          const selected = editor.getModel().getValueInRange(editor.getSelection());
          askInline(`Explain this code:\n${selected || editor.getValue()}`);
        }
      });
    });
  } catch (error) {
    console.error('[INCLAW] monaco init failed', error);
  }
}

/**
 * Renders file explorer list and binds open/create/rename/delete actions.
 */
function bindFiles() {
  const tree = document.getElementById('file-tree');
  const render = () => {
    tree.innerHTML = '';
    Object.keys(files).forEach((name) => {
      const row = document.createElement('div');
      row.className = 'file-row';
      row.innerHTML = `<button class="open">${iconFor(name)} ${name}</button><div><button class="rename">✎</button><button class="delete">🗑</button></div>`;
      row.querySelector('.open').addEventListener('click', () => openFile(name));
      row.querySelector('.rename').addEventListener('click', () => renameFile(name));
      row.querySelector('.delete').addEventListener('click', () => deleteFile(name));
      tree.appendChild(row);
    });
  };

  document.getElementById('new-file')?.addEventListener('click', () => {
    const name = sanitizeFileName(prompt('File name?') || '');
    if (!name) return;
    files[name] = '';
    render();
    openFile(name);
  });

  document.getElementById('new-folder')?.addEventListener('click', () => alert('Folders are simulated in this browser workspace.'));
  render();
}

/**
 * Returns an icon token for a file extension.
 */
function iconFor(name) {
  if (name.endsWith('.js')) return '🟨';
  if (name.endsWith('.py')) return '🐍';
  if (name.endsWith('.css')) return '🎨';
  if (name.endsWith('.html')) return '🌐';
  return '📄';
}

/**
 * Opens a file in Monaco and applies matching language mode.
 */
function openFile(name) {
  try {
    if (!editor) return;
    const model = monaco.editor.createModel(files[name] || '', languageFor(name));
    editor.setModel(model);
    editor.focus();
  } catch (error) {
    console.error('[INCLAW] openFile failed', error);
  }
}

/**
 * Renames a file key in the in-memory explorer.
 */
function renameFile(oldName) {
  try {
    const next = sanitizeFileName(prompt('Rename to:', oldName) || '');
    if (!next || next === oldName) return;
    files[next] = files[oldName];
    delete files[oldName];
    bindFiles();
  } catch (error) {
    console.error('[INCLAW] renameFile failed', error);
  }
}

/**
 * Deletes a file key from in-memory explorer.
 */
function deleteFile(name) {
  try {
    if (!confirm(`Delete ${name}?`)) return;
    delete files[name];
    bindFiles();
  } catch (error) {
    console.error('[INCLAW] deleteFile failed', error);
  }
}

/**
 * Maps filename to Monaco language id.
 */
function languageFor(name) {
  if (name.endsWith('.js')) return 'javascript';
  if (name.endsWith('.ts')) return 'typescript';
  if (name.endsWith('.py')) return 'python';
  if (name.endsWith('.css')) return 'css';
  if (name.endsWith('.html')) return 'html';
  if (name.endsWith('.rs')) return 'rust';
  return 'plaintext';
}

/**
 * Applies starter files based on selected project template.
 */
function bindTemplates() {
  document.getElementById('template')?.addEventListener('change', (e) => {
    try {
      const value = e.target.value;
      if (value === 'Static HTML') files = { 'index.html': '<!doctype html>\n<html></html>', 'style.css': '/* styles */', 'script.js': '// js' };
      if (value === 'React') files = { 'index.html': '<div id="root"></div>', 'App.jsx': 'export default function App(){ return <h1>Hello</h1> }', 'package.json': '{"name":"app"}' };
      if (value === 'Express') files = { 'server.js': 'const express=require("express")', 'package.json': '{"scripts":{"start":"node server.js"}}', '.env.example': 'PORT=3000' };
      if (value === 'Python Script') files = { 'main.py': 'print("hello")', 'requirements.txt': '' };
      if (value === 'FastAPI') files = { 'main.py': 'from fastapi import FastAPI\napp=FastAPI()', 'requirements.txt': 'fastapi\nuvicorn' };
      bindFiles();
      openFile(Object.keys(files)[0]);
    } catch (error) {
      console.error('[INCLAW] template change failed', error);
    }
  });
}

/**
 * Binds AI sidebar quick actions and prompt send flow.
 */
function bindAiActions() {
  const input = document.getElementById('ide-input');
  const out = document.getElementById('ide-chat');
  const status = document.getElementById('ide-status');

  const ask = async (promptText) => {
    try {
      status.textContent = 'INCLAW is thinking...';
      const stream = await callINCLAW([{ role: 'user', content: promptText }], document.getElementById('ide-model').value, localStorage.getItem('inclaw_plan') || 'free');
      const box = document.createElement('div');
      box.className = 'card';
      out.appendChild(box);
      let full = '';
      for await (const chunk of stream) {
        full += chunk?.message?.content || '';
        box.textContent = full;
      }
      if (editor && full.length > 0) {
        const selection = editor.getSelection();
        const pos = editor.getPosition();
        const range = selection && !selection.isEmpty()
          ? selection
          : new monaco.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column);
        editor.executeEdits('inclaw', [{ range, text: full }]);
      }
    } catch (error) {
      out.innerHTML += `<div class="card">⚠️ ${error.message}</div>`;
    } finally {
      status.textContent = 'Ready';
      out.scrollTop = out.scrollHeight;
    }
  };

  document.getElementById('ide-send')?.addEventListener('click', () => {
    const p = input.value.trim();
    if (!p) return;
    input.value = '';
    ask(p);
  });

  document.querySelectorAll('[data-quick]').forEach((btn) => {
    btn.addEventListener('click', () => ask(`${btn.dataset.quick}:\n\n${editor?.getValue() || ''}`));
  });
}

/**
 * Prompts user for an inline Ctrl+K request.
 */
function promptInline() {
  try {
    return prompt('Ask INCLAW about selected code:');
  } catch (error) {
    console.error('[INCLAW] promptInline failed', error);
    return '';
  }
}

/**
 * Runs inline assistant request and inserts response at cursor.
 */
async function askInline(message) {
  try {
    const stream = await callINCLAW([{ role: 'user', content: message }], 'auto', localStorage.getItem('inclaw_plan') || 'free');
    let full = '';
    for await (const chunk of stream) {
      full += chunk?.message?.content || '';
    }
    if (editor) editor.executeEdits('inclaw-inline', [{ range: editor.getSelection(), text: full }]);
  } catch (error) {
    console.error('[INCLAW] askInline failed', error);
  }
}

/**
 * Sanitizes user-provided file names to avoid invalid keys and prototype pollution.
 * Dotfiles (for example .env) are intentionally allowed for template workflows.
 */
function sanitizeFileName(name) {
  const trimmed = name.trim().replace(/[/\\]/g, '_');
  if (!trimmed) return '';
  if (['__proto__', 'prototype', 'constructor'].includes(trimmed)) return '';
  if (!/^[a-zA-Z0-9._-]+$/.test(trimmed)) return '';
  if (trimmed.length > 120) return '';
  return trimmed;
}
