/**
 * chat-handler.js — Chat History & UI Controller for INCLAW
 *
 * Manages the conversation state, renders messages to the DOM,
 * handles streaming display, and coordinates model selection.
 *
 * Exports: ChatHandler
 */

import { detectTaskType, getModelForTask } from "./model-router.js";
import { sendAIMessage } from "./puter-backend.js";

/* ── Constants ────────────────────────────────────────────── */
const MAX_HISTORY = 20;            // Keep last 20 messages for context
const COPY_FEEDBACK_DURATION_MS = 2000; // "Copied!" feedback duration

/**
 * ChatHandler class — manages the full chat lifecycle.
 */
export class ChatHandler {
  /**
   * @param {Object} elements — DOM element references
   * @param {HTMLElement} elements.chatArea — the scrollable chat container
   * @param {HTMLElement} elements.modelBadge — the model badge element
   * @param {HTMLTextAreaElement} elements.input — the textarea input
   * @param {HTMLButtonElement} elements.sendBtn — the send button
   */
  constructor(elements) {
    this.chatArea = elements.chatArea;
    this.modelBadge = elements.modelBadge;
    this.input = elements.input;
    this.sendBtn = elements.sendBtn;

    /** @type {Array<{role: string, content: string}>} */
    this.history = [];

    /** @type {boolean} */
    this.isStreaming = false;

    /** @type {HTMLElement|null} */
    this.welcomeEl = document.getElementById("welcome");
  }

  /**
   * Sends a user message, detects the task type,
   * selects the model, and streams the AI response.
   *
   * @param {string} userMessage — the user's input text
   */
  async send(userMessage) {
    if (!userMessage.trim() || this.isStreaming) return;

    /* Hide welcome screen on first message */
    if (this.welcomeEl) {
      this.welcomeEl.style.display = "none";
    }

    /* 1. Detect task type and select model */
    const taskType = detectTaskType(userMessage);
    const modelInfo = getModelForTask(taskType);
    console.log(
      `[INCLAW] Task type: ${taskType} → Model: ${modelInfo.model} (${modelInfo.mode})`
    );

    /* 2. Update the model badge in the UI */
    this.updateModelBadge(modelInfo);

    /* 3. Add user message to history and render */
    this.addMessage("user", userMessage);
    this.renderUserMessage(userMessage);

    /* 4. Show typing indicator */
    const typingEl = this.showTypingIndicator();

    /* 5. Lock input during streaming */
    this.setStreaming(true);

    /* 6. Prepare messages for the API (last MAX_HISTORY messages) */
    const apiMessages = this.history.slice(-MAX_HISTORY);

    try {
      /* 7. Create assistant message bubble for streaming */
      const assistantEl = this.createAssistantBubble();

      /* 8. Remove typing indicator once first chunk arrives */
      let typingRemoved = false;

      /* 9. Stream the AI response */
      const fullResponse = await sendAIMessage(
        apiMessages,
        modelInfo.model,
        (partialText) => {
          /* Remove typing indicator on first chunk */
          if (!typingRemoved) {
            typingEl.remove();
            typingRemoved = true;
          }
          /* Render markdown as it streams */
          this.renderMarkdown(assistantEl, partialText);
          this.scrollToBottom();
        }
      );

      /* 10. Ensure typing indicator is removed */
      if (!typingRemoved) {
        typingEl.remove();
      }

      /* 11. Final render with syntax highlighting */
      this.renderMarkdown(assistantEl, fullResponse);
      this.addCopyButtons(assistantEl);
      this.highlightCode(assistantEl);

      /* 12. Add assistant response to history */
      this.addMessage("assistant", fullResponse);
    } catch (error) {
      /* Handle errors gracefully */
      console.error("[INCLAW] Error:", error);
      typingEl.remove();
      this.renderErrorMessage(error.message);
    } finally {
      /* 13. Unlock input */
      this.setStreaming(false);
      this.scrollToBottom();
    }
  }

  /**
   * Adds a message to the conversation history.
   * Trims history to MAX_HISTORY to manage context window.
   *
   * @param {string} role — "user" or "assistant"
   * @param {string} content — the message text
   */
  addMessage(role, content) {
    this.history.push({ role, content });
    /* Trim to keep last MAX_HISTORY messages */
    if (this.history.length > MAX_HISTORY) {
      this.history = this.history.slice(-MAX_HISTORY);
    }
  }

  /**
   * Renders a user message bubble in the chat area.
   *
   * @param {string} text — the user's message text
   */
  renderUserMessage(text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message user";

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";
    contentDiv.textContent = text;

    msgDiv.appendChild(contentDiv);
    this.chatArea.appendChild(msgDiv);
    this.scrollToBottom();
  }

  /**
   * Creates an empty assistant message bubble for streaming content.
   *
   * @returns {HTMLElement} — the content div to stream into
   */
  createAssistantBubble() {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message assistant";

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";

    msgDiv.appendChild(contentDiv);
    this.chatArea.appendChild(msgDiv);

    return contentDiv;
  }

  /**
   * Renders markdown content into an element using marked.js.
   * Falls back to plain text if marked is not loaded.
   *
   * @param {HTMLElement} el — the target element
   * @param {string} text — raw markdown text
   */
  renderMarkdown(el, text) {
    if (typeof marked !== "undefined" && marked.parse) {
      el.innerHTML = marked.parse(text);
    } else {
      el.textContent = text;
    }
  }

  /**
   * Adds a copy button to every <pre><code> block inside an element.
   *
   * @param {HTMLElement} container — the parent element to search within
   */
  addCopyButtons(container) {
    const codeBlocks = container.querySelectorAll("pre");
    codeBlocks.forEach((pre) => {
      /* Skip if already has a copy button */
      if (pre.querySelector(".copy-btn")) return;

      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.addEventListener("click", () => {
        const code = pre.querySelector("code");
        const text = code ? code.textContent : pre.textContent;
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = "Copied!";
          btn.classList.add("copied");
          setTimeout(() => {
            btn.textContent = "Copy";
            btn.classList.remove("copied");
          }, COPY_FEEDBACK_DURATION_MS);
        });
      });
      /* Ensure pre is positioned for absolute button placement */
      pre.style.position = "relative";
      pre.appendChild(btn);
    });
  }

  /**
   * Applies syntax highlighting to code blocks using highlight.js.
   *
   * @param {HTMLElement} container — the parent element
   */
  highlightCode(container) {
    if (typeof hljs !== "undefined") {
      container.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }

  /**
   * Shows the "INCLAW is thinking..." typing indicator.
   *
   * @returns {HTMLElement} — the typing indicator element (for later removal)
   */
  showTypingIndicator() {
    const el = document.createElement("div");
    el.className = "typing-indicator";
    el.innerHTML = `
      <div class="typing-dots">
        <span></span><span></span><span></span>
      </div>
      INCLAW is thinking...
    `;
    this.chatArea.appendChild(el);
    this.scrollToBottom();
    return el;
  }

  /**
   * Renders an error message in the chat area.
   *
   * @param {string} errorText — the error message to display
   */
  renderErrorMessage(errorText) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message assistant";

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";
    contentDiv.style.borderColor = "rgba(239, 68, 68, 0.3)";
    contentDiv.textContent = `⚠️ Error: ${errorText}`;

    msgDiv.appendChild(contentDiv);
    this.chatArea.appendChild(msgDiv);
  }

  /**
   * Updates the model badge in the header.
   *
   * @param {{ label: string, mode: string, badgeClass: string }} modelInfo
   */
  updateModelBadge(modelInfo) {
    this.modelBadge.className = `model-badge ${modelInfo.badgeClass}`;
    this.modelBadge.innerHTML = `
      <span class="dot"></span>
      ${modelInfo.label} — ${modelInfo.mode}
    `;
  }

  /**
   * Locks or unlocks the input area during streaming.
   *
   * @param {boolean} streaming — true to lock, false to unlock
   */
  setStreaming(streaming) {
    this.isStreaming = streaming;
    this.sendBtn.disabled = streaming;
    this.input.disabled = streaming;
    if (!streaming) {
      this.input.focus();
    }
  }

  /**
   * Scrolls the chat area to the bottom.
   */
  scrollToBottom() {
    requestAnimationFrame(() => {
      this.chatArea.scrollTop = this.chatArea.scrollHeight;
    });
  }

  /**
   * Clears the chat history and UI, restoring the welcome screen.
   */
  clearChat() {
    this.history = [];
    /* Remove all messages and typing indicators */
    this.chatArea
      .querySelectorAll(".message, .typing-indicator")
      .forEach((el) => el.remove());
    /* Show welcome screen again */
    if (this.welcomeEl) {
      this.welcomeEl.style.display = "flex";
    }
    /* Reset model badge */
    this.modelBadge.className = "model-badge chat";
    this.modelBadge.innerHTML = `<span class="dot"></span> Ready`;
    console.log("[INCLAW] Chat cleared.");
  }
}
