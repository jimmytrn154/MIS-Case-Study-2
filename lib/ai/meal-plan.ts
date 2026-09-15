import "server-only";

import { z } from "zod";
import { products } from "@/data/products";
import { getEffectivePrice, getItemSubtotal, getItemSavings } from "@/lib/cart";
import { normalizeQuantity } from "@/lib/quantity";
import { generateChatReply, generateStructuredReply } from "./gemini";
import { buildSystemPrompt, buildMealPlanSystemPrompt } from "./system-prompt";
import {
  mealPlanResponseSchema,
  type MealPlanResponse,
  type Meal,
  type MealIngredient,
} from "@/types/meal-plan";
import type { ChatMessage } from "@/types/chat";
import type { AssistantStructuredContext } from "@/types/assistant-context";

/**
 * The shape we ask Gemini to produce. Deliberately excludes price/cost
 * fields — the model decides meal composition (which products, how much),
 * and application code (resolveMealPlan below) computes every dollar
 * amount from real FreshWave product data.
 */
const rawIngredientSchema = z.object({
  productId: z
    .string()
    .min(1)
    .describe(
      "Must exactly match a product id from the FreshWave inventory list in the context above.",
    ),
  quantity: z
    .number()
    .min(0.1)
    .describe(
      "How many of this product's listed unit to buy. Only 'per lb' products may be fractional (e.g. 1.5); every other unit (each, dozen, a bag, a jar, ...) is a whole package or piece — use a whole number like 1 or 2.",
    ),
});

const rawMealSchema = z.object({
  day: z.string().min(1).describe("e.g. 'Monday' or 'Day 1'."),
  name: z
    .string()
    .min(1)
    .describe("Short meal name, e.g. 'Grilled chicken with roasted broccoli'."),
  ingredients: z.array(rawIngredientSchema).min(1),
});

const rawEnvelopeSchema = z.object({
  message: z
    .string()
    .min(1)
    .describe("A short, friendly conversational reply to the customer."),
  mealPlan: z
    .array(rawMealSchema)
    .describe(
      "One entry per meal, only when a meal plan was requested. Otherwise an empty array.",
    ),
  budget: z
    .number()
    .min(1)
    .optional()
    .describe(
      "The customer's stated budget in dollars, if they mentioned one. Omit otherwise.",
    ),
});

type RawEnvelope = z.infer<typeof rawEnvelopeSchema>;

function toGeminiJsonSchema(): unknown {
  const schema = z.toJSONSchema(rawEnvelopeSchema) as Record<string, unknown>;
  delete schema.$schema;
  return schema;
}

function resolveIngredient(
  raw: z.infer<typeof rawIngredientSchema>,
): MealIngredient | null {
  const product = products.find((p) => p.id === raw.productId);
  if (!product) return null;

  // The model's own arithmetic isn't trusted for units either — snap to
  // something actually purchasable (whole packages, or quarter-pound steps
  // for weight-based products) before ever storing or pricing it.
  const quantity = Math.min(normalizeQuantity(raw.quantity, product.unit), product.stock);
  if (quantity <= 0) return null;

  return {
    productId: product.id,
    productName: product.name,
    unit: product.unit,
    quantity,
    unitPrice: getEffectivePrice(product),
    lineCost: getItemSubtotal(product, quantity),
    promotion: product.promotion,
  };
}

function resolveMeal(raw: z.infer<typeof rawMealSchema>): Meal | null {
  const ingredients = raw.ingredients
    .map(resolveIngredient)
    .filter((ingredient): ingredient is MealIngredient => ingredient !== null);

  if (ingredients.length === 0) return null;

  return {
    day: raw.day,
    name: raw.name,
    estimatedCost: ingredients.reduce((sum, i) => sum + i.lineCost, 0),
    ingredients,
  };
}

/**
 * Turns model-decided meal composition into a fully-priced response.
 * Unknown product ids or out-of-stock ingredients are dropped rather than
 * trusted; a meal left with no valid ingredients is dropped entirely. This
 * never throws — worst case, mealPlan ends up empty.
 */
export function resolveMealPlan(raw: RawEnvelope): MealPlanResponse {
  const mealPlan = raw.mealPlan
    .map(resolveMeal)
    .filter((meal): meal is Meal => meal !== null);

  const estimatedTotal = mealPlan.reduce((sum, meal) => sum + meal.estimatedCost, 0);
  const estimatedSavings = mealPlan.reduce(
    (sum, meal) =>
      sum +
      meal.ingredients.reduce((mealSum, ingredient) => {
        const product = products.find((p) => p.id === ingredient.productId);
        return product ? mealSum + getItemSavings(product, ingredient.quantity) : mealSum;
      }, 0),
    0,
  );

  const resolved: MealPlanResponse = {
    message: raw.message,
    mealPlan,
    estimatedTotal,
    estimatedSavings,
    budget: raw.budget,
  };

  // Final safety net — should always pass since we built this from validated,
  // computed data, but never trust structured output without checking.
  return mealPlanResponseSchema.parse(resolved);
}

async function requestEnvelope(
  message: string,
  history: ChatMessage[],
  context: AssistantStructuredContext,
): Promise<RawEnvelope | null> {
  try {
    const raw = await generateStructuredReply(
      message,
      history,
      buildMealPlanSystemPrompt(context),
      toGeminiJsonSchema(),
    );
    const parsed: unknown = JSON.parse(raw);
    const result = rawEnvelopeSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/**
 * Main entry point for the assistant. Tries structured JSON output (retrying
 * once on invalid/malformed JSON), and if that still fails, falls back to a
 * plain conversational reply so the customer always gets an answer.
 */
export async function generateAssistantReply(
  message: string,
  history: ChatMessage[],
  context: AssistantStructuredContext,
): Promise<MealPlanResponse> {
  let envelope = await requestEnvelope(message, history, context);
  if (!envelope) {
    envelope = await requestEnvelope(message, history, context);
  }

  if (!envelope) {
    const text = await generateChatReply(message, history, buildSystemPrompt(context));
    envelope = { message: text, mealPlan: [] };
  }

  return resolveMealPlan(envelope);
}
