import { NextResponse } from "next/server";
import { z } from "zod";
import { generateAssistantReply } from "@/lib/ai/meal-plan";
import { buildAssistantStructuredContext } from "@/lib/assistant-context";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const chatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty.").max(2000),
  history: z.array(chatMessageSchema).max(10).optional().default([]),
  pantryItems: z.array(
    z.object({
      id: z.string().min(1),
      customerId: z.string().min(1),
      productId: z.string().min(1),
      quantity: z.number().min(0).max(100_000),
      unit: z.string().min(1),
      purchasedAt: z.string().min(1),
      expiresAt: z.string().optional(),
      openedAt: z.string().optional(),
      lowStockThreshold: z.number().min(0),
      status: z.enum(["fresh", "use-soon", "expired", "low-stock"]),
    }),
  ).max(50).optional().default([]),
  cartItems: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().positive().max(1_000),
    }),
  ).max(100).optional().default([]),
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

  const { message, history, pantryItems, cartItems } = parsed.data;

  try {
    const context = buildAssistantStructuredContext({ pantryItems, cartItems });
    const result = await generateAssistantReply(message, history, context);
    return NextResponse.json(result);
  } catch (error) {
    const safeMessage =
      error instanceof Error
        ? error.message
        : "FreshWave Assistant is temporarily unavailable. Please try again.";
    return NextResponse.json({ error: safeMessage }, { status: 502 });
  }
}
