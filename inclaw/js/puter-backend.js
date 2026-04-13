import { selectModel } from './model-router.js';

/**
 * Public model map for manual model selection.
 */
export const MODELS = {
  auto: null,
  'llama-3.3-70b': 'llama-3.3-70b',
  'llama-3.1-8b': 'llama-3.1-8b-instant',
  'deepseek-coder': 'deepseek-coder',
  'deepseek-r1': 'deepseek-r1',
  'gemma-3': 'gemma-3-27b',
  'phi-4': 'phi-4',
  'mixtral': 'mixtral-8x7b',
  'qwen-coder': 'qwen2.5-coder-32b',
  'codellama': 'codellama-34b',
  'starcoder2': 'starcoder2-15b',
  'gpt-4o-mini': 'gpt-4o-mini',
  'claude-sonnet': 'claude-sonnet-4-5',
  'gemini-flash': 'gemini-2.0-flash'
};

const SYSTEM_PROMPT = `You are INCLAW — India's most powerful open-source AI assistant.
You are warm, direct, expert at coding, reasoning, and problem solving.
Built by Ansh Kumar from India for developers worldwide.
Always think step by step for complex problems.
For code: write clean, commented, production-ready code with error handling.
For chat: be concise, friendly, genuinely helpful.
Never hallucinate — say 'I am not sure, let me think' when uncertain.
Format responses with proper markdown. Use code blocks for all code.`;

/**
 * Waits until the Puter SDK is available in the current page.
 */
async function ensurePuter() {
  try {
    if (typeof window.puter?.ai?.chat === 'function') return;
    await new Promise((resolve, reject) => {
      const started = Date.now();
      const t = setInterval(() => {
        if (typeof window.puter?.ai?.chat === 'function') { clearInterval(t); resolve(); }
        if (Date.now() - started > 15000) { clearInterval(t); reject(new Error('Puter load timeout')); }
      }, 200);
    });
  } catch (error) {
    console.error('[INCLAW] Puter unavailable', error);
    throw error;
  }
}

/**
 * Calls INCLAW with streaming and plan-based model restrictions.
 */
export async function callINCLAW(messages, modelKey = 'auto', userPlan = 'free') {
  try {
    await ensurePuter();
    const proOnlyModels = ['gpt-4o-mini', 'claude-sonnet', 'gemini-flash'];
    if (proOnlyModels.includes(modelKey) && userPlan === 'free') {
      throw new Error('PLAN_REQUIRED: This model requires Pro or Max plan');
    }

    const lastUserText = messages[messages.length - 1]?.content || '';
    const autoSelection = selectModel(lastUserText);
    const model = modelKey === 'auto' ? autoSelection.model : MODELS[modelKey];
    if (!model) throw new Error('Unsupported model selected');

    console.log(`[INCLAW] taskType=${autoSelection.taskType} model=${model}`);

    const payload = [{ role: 'system', content: SYSTEM_PROMPT }, ...messages];
    return await window.puter.ai.chat(payload, { model, stream: true });
  } catch (error) {
    console.error('[INCLAW] call failed', error);
    if (modelKey !== 'llama-3.1-8b') {
      const fallback = MODELS['llama-3.1-8b'];
      console.log(`[INCLAW] fallback model=${fallback}`);
      const payload = [{ role: 'system', content: SYSTEM_PROMPT }, ...messages];
      return await window.puter.ai.chat(payload, { model: fallback, stream: true });
    }
    throw error;
  }
}
