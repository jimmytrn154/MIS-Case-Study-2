import "server-only";

import { z } from "zod";
import { products } from "@/data/products";
import { generateStructuredReply } from "@/lib/ai/gemini";
import { resolvePantryRecipe, type RawPantryRecipe } from "@/lib/pantry-recipe-core";
import { pantryRecipeSchema, type PantryRecipe } from "@/types/pantry-recipe";
import type { PantryItem } from "@/types/intelligence";

const rawPantryRecipeSchema = z.object({
  message: z.string().min(1),
  name: z.string().min(1),
  summary: z.string().min(1),
  ingredients: z.array(z.object({ productId: z.string().min(1), quantity: z.number().positive() })).min(1),
  instructions: z.array(z.string().min(1)).min(1),
});

function jsonSchema() {
  const schema = z.toJSONSchema(rawPantryRecipeSchema) as Record<string, unknown>;
  delete schema.$schema;
  return schema;
}

function systemPrompt(pantryItems: PantryItem[]): string {
  const productById = new Map(products.map((product) => [product.id, product]));
  const context = pantryItems.map((item) => ({
    productId: item.productId,
    productName: productById.get(item.productId)?.name,
    availableQuantity: item.quantity,
    unit: item.unit,
    expiresAt: item.expiresAt,
    status: item.status,
  }));

  return `You are FreshWave Assistant creating one practical recipe from Sarah's Virtual Pantry.

STRICT GROUNDING RULES
- Use only products listed in the supplied pantry context.
- Never invent pantry quantities, units, expiry dates, harvest dates, discounts, aisle locations, products, prices, farms, or availability.
- Never claim indoor GPS, live positioning, or an exact customer location.
- Application logic is authoritative for prices, discounts, inventory, dates, pantry state, restock predictions, and store routes.
- Ingredient quantity means how much to consume from the pantry and must not exceed availableQuantity.
- Prioritize items marked use-soon when they can form a sensible meal.
- Do not claim an order, payment, or purchase occurred.
- Return only JSON matching the required schema.

FreshWave pantry context:
${JSON.stringify(context, null, 2)}`;
}

export async function generatePantryRecipe(pantryItems: PantryItem[]): Promise<PantryRecipe> {
  const usableItems = pantryItems.filter((item) => item.quantity > 0 && item.status !== "expired");
  if (usableItems.length === 0) throw new Error("No usable pantry ingredients are available.");

  const response = await generateStructuredReply(
    "Create one recipe using what I have, prioritizing ingredients that expire soon.",
    [],
    systemPrompt(usableItems),
    jsonSchema(),
  );
  const parsed: unknown = JSON.parse(response);
  const raw = rawPantryRecipeSchema.parse(parsed) as RawPantryRecipe;
  return pantryRecipeSchema.parse(resolvePantryRecipe(raw, usableItems, products));
}
