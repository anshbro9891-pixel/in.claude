/**
 * puter-backend.js — Puter.js AI Backend for INCLAW
 *
 * Handles all AI calls through the free Puter.js SDK.
 * Supports streaming responses and automatic fallback.
 *
 * Puter.js requires no API key — it runs entirely in-browser.
 *
 * Exports: sendAIMessage, INCLAW_SYSTEM_PROMPT
 */

import { FALLBACK_MODEL } from "./model-router.js";

/* ── INCLAW System Prompt ─────────────────────────────────── */
export const INCLAW_SYSTEM_PROMPT =
  "You are INCLAW — India's most powerful open-source AI assistant, " +
  "built by Indian engineers for the world. " +
  "You are warm, direct, and expert at coding and reasoning. " +
  "Always think step by step for complex problems. " +
  "For code: write clean, commented, production-ready code. " +
  "For chat: be concise, friendly, and helpful. " +
  "Never hallucinate — say 'I am not sure' when uncertain.";

/**
 * Waits for the Puter.js SDK to be ready.
 * Puter loads asynchronously from the CDN; this ensures
 * the global `puter` object is available.
 *
 * @returns {Promise<void>}
 */
function waitForPuter() {
  return new Promise((resolve, reject) => {
    /* Already loaded */
    if (typeof puter !== "undefined" && puter.ai) {
      resolve();
      return;
    }
    /* Poll every 200ms, timeout after 15s */
    let elapsed = 0;
    const interval = setInterval(() => {
      if (typeof puter !== "undefined" && puter.ai) {
        clearInterval(interval);
        resolve();
      }
      elapsed += 200;
      if (elapsed > 15000) {
        clearInterval(interval);
        reject(new Error("Puter.js SDK failed to load within 15 seconds."));
      }
    }, 200);
  });
}

/**
 * Sends a message to the AI model via Puter.js with streaming.
 *
 * @param {Array<{role: string, content: string}>} messages — conversation history
 * @param {string} model — the model ID to use (e.g., "deepseek-coder")
 * @param {function(string): void} onChunk — callback invoked with each text chunk
 * @returns {Promise<string>} — the complete response text
 */
export async function sendAIMessage(messages, model, onChunk) {
  await waitForPuter();

  /* Prepend the system prompt as the first message */
  const fullMessages = [
    { role: "system", content: INCLAW_SYSTEM_PROMPT },
    ...messages,
  ];

  try {
    console.log(`[INCLAW] Sending to model: ${model}`);
    return await streamFromModel(fullMessages, model, onChunk);
  } catch (primaryError) {
    /* Fallback: if primary model fails, retry with the fallback model */
    console.warn(
      `[INCLAW] Primary model "${model}" failed:`,
      primaryError.message
    );
    console.log(`[INCLAW] Falling back to: ${FALLBACK_MODEL}`);

    try {
      return await streamFromModel(fullMessages, FALLBACK_MODEL, onChunk);
    } catch (fallbackError) {
      console.error("[INCLAW] Fallback model also failed:", fallbackError);
      throw new Error(
        "Both primary and fallback models failed. Please try again later."
      );
    }
  }
}

/**
 * Internal helper — streams a response from a specific model.
 *
 * @param {Array<{role: string, content: string}>} messages
 * @param {string} model
 * @param {function(string): void} onChunk
 * @returns {Promise<string>}
 */
async function streamFromModel(messages, model, onChunk) {
  /* Call Puter.js AI chat with streaming enabled */
  const response = await puter.ai.chat(messages, {
    model: model,
    stream: true,
  });

  let fullText = "";

  /* Iterate over the async stream of chunks */
  for await (const chunk of response) {
    const text = chunk?.message?.content || "";
    if (text) {
      fullText += text;
      onChunk(fullText);
    }
  }

  /* If we got no text at all, throw to trigger fallback */
  if (!fullText.trim()) {
    throw new Error(`Model "${model}" returned an empty response.`);
  }

  return fullText;
}
