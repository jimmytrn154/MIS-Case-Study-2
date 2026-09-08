import { NextResponse } from "next/server";
import { z } from "zod";
import { generateChatReply } from "@/lib/ai/gemini";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const chatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty.").max(2000),
  history: z.array(chatMessageSchema).max(10).optional().default([]),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { message, history } = parsed.data;

  try {
    const reply = await generateChatReply(message, history, buildSystemPrompt());
    return NextResponse.json({ reply });
  } catch (error) {
    const safeMessage =
      error instanceof Error
        ? error.message
        : "FreshWave Assistant is temporarily unavailable. Please try again.";
    return NextResponse.json({ error: safeMessage }, { status: 502 });
  }
}
