import type { Product } from "../types/grocery.ts";
import type { PantryItem } from "../types/intelligence.ts";
import type { PantryRecipe } from "../types/pantry-recipe.ts";

export interface RawPantryRecipe {
  message: string;
  name: string;
  summary: string;
  ingredients: { productId: string; quantity: number }[];
  instructions: string[];
}

export function resolvePantryRecipe(
  raw: RawPantryRecipe,
  pantryItems: PantryItem[],
  catalog: Product[],
): PantryRecipe {
  const productById = new Map(catalog.map((product) => [product.id, product]));
  const remainingByPantryId = new Map(
    pantryItems.map((item) => [item.id, Math.max(0, item.quantity)]),
  );
  const resolvedByPantryId = new Map<
    string,
    PantryRecipe["recipe"]["ingredients"][number]
  >();

  for (const ingredient of raw.ingredients) {
    if (ingredient.quantity <= 0) continue;
    const pantryItem = pantryItems.find(
      (item) =>
        item.productId === ingredient.productId &&
        (remainingByPantryId.get(item.id) ?? 0) > 0,
    );
    const product = productById.get(ingredient.productId);
    if (!pantryItem || !product) continue;

    const remaining = remainingByPantryId.get(pantryItem.id) ?? 0;
    const quantity = Math.min(
      remaining,
      Math.round(ingredient.quantity * 100) / 100,
    );
    if (quantity <= 0) continue;
    remainingByPantryId.set(pantryItem.id, remaining - quantity);

    const existing = resolvedByPantryId.get(pantryItem.id);
    if (existing) {
      existing.quantity = Math.round((existing.quantity + quantity) * 100) / 100;
    } else {
      resolvedByPantryId.set(pantryItem.id, {
        pantryItemId: pantryItem.id,
        productId: product.id,
        productName: product.name,
        quantity,
        unit: pantryItem.unit,
      });
    }
  }

  const ingredients = [...resolvedByPantryId.values()];
  if (ingredients.length === 0) {
    throw new Error("The recipe did not use any available pantry items.");
  }

  return {
    message: raw.message,
    recipe: {
      name: raw.name,
      summary: raw.summary,
      ingredients,
      instructions: raw.instructions,
    },
  };
}
