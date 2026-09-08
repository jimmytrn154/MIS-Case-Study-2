import "server-only";

import { GoogleGenAI, type ContentListUnion } from "@google/genai";
import { withModelFallback, getConfiguredModels, type ModelAttemptLog } from "./model-fallback";
import type { ChatMessage } from "@/types/chat";

let cachedClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }
  if (!cachedClient) {
    cachedClient = new GoogleGenAI({ apiKey });
  }
  return cachedClient;
}

function buildContents(message: string, history: ChatMessage[]): ContentListUnion {
  return [
    ...history.map((turn) => ({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.content }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];
}

/** Logs model name, outcome, error category, and latency — never the API key or request/response content. */
function logAttempt(log: ModelAttemptLog) {
  const outcome = log.success ? "ok" : `failed (${log.category})`;
  console.log(
    `[FreshWave Assistant] model=${log.model} ${outcome} latency=${log.latencyMs}ms`,
  );
}

function logSanitizedError(error: unknown) {
  console.error(
    "[FreshWave Assistant] Gemini request failed:",
    error instanceof Error ? error.message : "Unknown error",
  );
}

/**
 * Sends the current message plus limited prior turns to Gemini as plain
 * text, grounded by the given system instruction. Tries each configured
 * model in order (see lib/ai/model-fallback.ts) and never throws the
 * underlying SDK error — callers only ever see a safe, generic message.
 */
export async function generateChatReply(
  message: string,
  history: ChatMessage[],
  systemInstruction: string,
): Promise<string> {
  const ai = getClient();
  const contents = buildContents(message, history);

  try {
    return await withModelFallback(
      getConfiguredModels(),
      async (model) => {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: { systemInstruction },
        });
        const text = response.text;
        if (!text) {
          throw new Error("Empty response from Gemini.");
        }
        return text;
      },
      logAttempt,
    );
  } catch (error) {
    logSanitizedError(error);
    throw new Error(
      "FreshWave Assistant is temporarily unavailable. Please try again.",
    );
  }
}

/**
 * Same as generateChatReply, but constrains Gemini to return JSON matching
 * the given JSON Schema. Returns the raw JSON text — callers are
 * responsible for parsing and Zod-validating it before trusting it.
 */
export async function generateStructuredReply(
  message: string,
  history: ChatMessage[],
  systemInstruction: string,
  jsonSchema: unknown,
): Promise<string> {
  const ai = getClient();
  const contents = buildContents(message, history);

  try {
    return await withModelFallback(
      getConfiguredModels(),
      async (model) => {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseJsonSchema: jsonSchema,
          },
        });
        const text = response.text;
        if (!text) {
          throw new Error("Empty structured response from Gemini.");
        }
        return text;
      },
      logAttempt,
    );
  } catch (error) {
    logSanitizedError(error);
    throw new Error(
      "FreshWave Assistant is temporarily unavailable. Please try again.",
    );
  }
}
