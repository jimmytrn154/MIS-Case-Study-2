import "server-only";

import { GoogleGenAI, type ContentListUnion } from "@google/genai";
import type { ChatMessage } from "@/types/chat";

const DEFAULT_MODEL = "gemini-2.5-flash";

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

/** The model name is configurable via env rather than hardcoded; no fallback chain yet. */
function getModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
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

function logSanitizedError(error: unknown) {
  console.error(
    "[FreshWave Assistant] Gemini request failed:",
    error instanceof Error ? error.message : "Unknown error",
  );
}

/**
 * Sends the current message plus limited prior turns to Gemini as plain
 * text, grounded by the given system instruction. Never throws the
 * underlying SDK error — callers only ever see a safe, generic message.
 */
export async function generateChatReply(
  message: string,
  history: ChatMessage[],
  systemInstruction: string,
): Promise<string> {
  const ai = getClient();

  try {
    const response = await ai.models.generateContent({
      model: getModel(),
      contents: buildContents(message, history),
      config: { systemInstruction },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini.");
    }
    return text;
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

  try {
    const response = await ai.models.generateContent({
      model: getModel(),
      contents: buildContents(message, history),
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
  } catch (error) {
    logSanitizedError(error);
    throw new Error(
      "FreshWave Assistant is temporarily unavailable. Please try again.",
    );
  }
}
