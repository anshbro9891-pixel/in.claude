import { callINCLAW } from './puter-backend.js';

/**
 * Creates a chat handler instance for chat page interactions.
 */
export function initChatPage() {
  try {
    const app = new ChatApp();
    app.bind();
  } catch (error) {
    console.error('[INCLAW] initChatPage failed', error);
  }
}

/**
 * Manages chat history, streaming rendering, and UI actions.
 */
class ChatApp {
  constructor() {
    this.messages = [];
    this.maxHistory = 20;
    this.activeChatId = crypto.randomUUID();
    this.el = {
      list: document.getElementById('chat-list'),
      msg: document.getElementById('messages'),
      input: document.getElementById('chat-text'),
      send: document.getElementById('send-btn'),
      model: document.getElementById('model-select'),
      typing: document.getElementById('typing-indicator')
    };
  }

  /**
   * Wires all events for chat UI.
   */
  bind() {
    this.el.send?.addEventListener('click', () => this.send());
    this.el.input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.send();
      }
    });
    this.el.input?.addEventListener('input', () => {
      this.el.input.style.height = 'auto';
      this.el.input.style.height = Math.min(this.el.input.scrollHeight, 140) + 'px';
    });
    document.getElementById('clear-btn')?.addEventListener('click', () => this.clear());
    document.getElementById('new-chat-btn')?.addEventListener('click', () => this.newChat());
    document.getElementById('new-chat-side-btn')?.addEventListener('click', () => this.newChat());
  }

  /**
   * Sends the user message and streams AI reply.
   */
  async send() {
    const text = this.el.input.value.trim();
    if (!text) return;
    this.el.input.value = '';
    this.el.input.style.height = 'auto';

    this.pushMessage('user', text);
    this.renderMessage('user', text);
    this.setTyping(true);

    try {
      const modelKey = this.el.model.value;
      const stream = await callINCLAW(this.messages.slice(-this.maxHistory), modelKey, localStorage.getItem('inclaw_plan') || 'free');
      const aiBubble = this.renderMessage('assistant', '', '...');
      let full = '';

      for await (const chunk of stream) {
        const txt = chunk?.message?.content || '';
        if (!txt) continue;
        full += txt;
        this.renderMarkdown(aiBubble, full);
      }

      this.pushMessage('assistant', full, modelKey === 'auto' ? 'auto-route' : modelKey);
      this.decorateCode(aiBubble);
    } catch (error) {
      this.renderMessage('assistant', `⚠️ ${error.message}`);
    } finally {
      this.setTyping(false);
    }
  }

  /**
   * Adds message object to state and keeps only last 20 for context.
   */
  pushMessage(role, content, model_used = '') {
    this.messages.push({ role, content, model_used, created_at: Date.now() });
    if (this.messages.length > this.maxHistory) this.messages = this.messages.slice(-this.maxHistory);
  }

  /**
   * Draws message bubble and returns assistant element for updates.
   */
  renderMessage(role, content, badge = '') {
    const wrap = document.createElement('div');
    wrap.className = `msg ${role}`;
    if (badge && role === 'assistant') {
      const b = document.createElement('div');
      b.className = 'badge';
      b.textContent = badge;
      wrap.appendChild(b);
    }
    const body = document.createElement('div');
    body.className = 'msg-body';
    body.textContent = content;
    wrap.appendChild(body);
    this.el.msg.appendChild(wrap);
    this.el.msg.scrollTop = this.el.msg.scrollHeight;
    return body;
  }

  /**
   * Renders markdown from AI content.
   */
  renderMarkdown(element, text) {
    try {
      if (window.marked?.parse) {
        element.innerHTML = window.marked.parse(text);
      } else {
        element.textContent = text;
      }
      this.el.msg.scrollTop = this.el.msg.scrollHeight;
    } catch (error) {
      console.error('[INCLAW] markdown render failed', error);
      element.textContent = text;
    }
  }

  /**
   * Adds syntax highlighting and copy buttons to code blocks.
   */
  decorateCode(container) {
    try {
      container.querySelectorAll('pre code').forEach((node) => {
        window.hljs?.highlightElement(node);
        const pre = node.closest('pre');
        if (!pre || pre.querySelector('.copy-code')) return;
        const btn = document.createElement('button');
        btn.className = 'copy-code';
        btn.textContent = 'Copy';
        btn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(node.textContent || '');
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = 'Copy', 2000);
          } catch (error) {
            console.error('[INCLAW] copy failed', error);
          }
        });
        pre.prepend(btn);
      });
    } catch (error) {
      console.error('[INCLAW] code decoration failed', error);
    }
  }

  /**
   * Toggles typing indicator state.
   */
  setTyping(show) {
    if (!this.el.typing) return;
    this.el.typing.style.display = show ? 'block' : 'none';
  }

  /**
   * Clears current chat content from UI/state.
   */
  clear() {
    this.messages = [];
    this.el.msg.innerHTML = '';
  }

  /**
   * Starts a new chat session and stores previous title in sidebar.
   */
  newChat() {
    try {
      const item = document.createElement('button');
      item.className = 'chat-item';
      item.textContent = `Chat ${new Date().toLocaleTimeString()}`;
      item.addEventListener('click', () => this.clear());
      this.el.list.prepend(item);
      this.activeChatId = crypto.randomUUID();
      this.clear();
    } catch (error) {
      console.error('[INCLAW] newChat failed', error);
    }
  }
}
