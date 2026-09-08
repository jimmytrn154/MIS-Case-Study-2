import "server-only";

import { GoogleGenAI } from "@google/genai";
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

/**
 * Sends the current message plus limited prior turns to Gemini, grounded by
 * the given system instruction. Never throws the underlying SDK error —
 * callers only ever see a safe, generic message.
 */
export async function generateChatReply(
  message: string,
  history: ChatMessage[],
  systemInstruction: string,
): Promise<string> {
  const ai = getClient();

  const contents = [
    ...history.map((turn) => ({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.content }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  try {
    const response = await ai.models.generateContent({
      model: getModel(),
      contents,
      config: { systemInstruction },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini.");
    }
    return text;
  } catch (error) {
    console.error(
      "[FreshWave Assistant] Gemini request failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    throw new Error(
      "FreshWave Assistant is temporarily unavailable. Please try again.",
    );
  }
}
