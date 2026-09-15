import { z } from "zod";

export const pantryRecipeIngredientSchema = z.object({
  pantryItemId: z.string(),
  productId: z.string(),
  productName: z.string(),
  quantity: z.number().positive(),
  unit: z.string(),
});

export const pantryRecipeSchema = z.object({
  message: z.string(),
  recipe: z.object({
    name: z.string(),
    summary: z.string(),
    ingredients: z.array(pantryRecipeIngredientSchema).min(1),
    instructions: z.array(z.string()).min(1),
  }),
});

export type PantryRecipe = z.infer<typeof pantryRecipeSchema>;
export type PantryRecipeIngredient = z.infer<typeof pantryRecipeIngredientSchema>;
