/**
 * Keyword buckets for auto model routing.
 */
const KEYWORDS = {
  code: ['code','function','bug','error','fix','build','api','class','python','javascript','js','rust','html','css','typescript','sql','database','debug','syntax','import','export','async','loop','array'],
  reasoning: ['why','explain','reason','analyze','compare','difference','how does','think','solve','math','calculate','logic','prove'],
  fast: ['quick','short','briefly','simple','one line','just tell','define','what does','meaning of']
};

/**
 * Maps route labels to puter model IDs.
 */
export const AUTO_MAP = {
  code: 'deepseek-coder',
  reasoning: 'deepseek-r1',
  fast: 'llama-3.1-8b-instant',
  chat: 'llama-3.3-70b'
};

/**
 * Detects task type by checking message text against keywords.
 */
export function detectTaskType(text = '') {
  try {
    const lower = text.toLowerCase();
    if (KEYWORDS.code.some((k) => lower.includes(k))) return 'code';
    if (KEYWORDS.reasoning.some((k) => lower.includes(k))) return 'reasoning';
    if (KEYWORDS.fast.some((k) => lower.includes(k))) return 'fast';
    return 'chat';
  } catch (error) {
    console.error('[INCLAW] detectTaskType failed', error);
    return 'chat';
  }
}

/**
 * Returns selected model and task mode details.
 */
export function selectModel(text = '') {
  try {
    const taskType = detectTaskType(text);
    const model = AUTO_MAP[taskType] || AUTO_MAP.chat;
    console.log(`[INCLAW] taskType=${taskType} model=${model}`);
    return { taskType, model };
  } catch (error) {
    console.error('[INCLAW] selectModel failed', error);
    return { taskType: 'chat', model: AUTO_MAP.chat };
  }
}
