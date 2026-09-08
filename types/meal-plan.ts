import { z } from "zod";

/**
 * The fully-resolved, application-priced meal-plan shape returned by
 * /api/chat and rendered by the UI. Every numeric field here is computed by
 * application code from real FreshWave product data — never trusted
 * verbatim from the model. Used as both the Zod validator (client-side,
 * before rendering) and the TypeScript type source.
 */
export const mealIngredientSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  unit: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  lineCost: z.number(),
  promotion: z.string().optional(),
});

export const mealSchema = z.object({
  day: z.string(),
  name: z.string(),
  estimatedCost: z.number(),
  ingredients: z.array(mealIngredientSchema),
});

export const mealPlanResponseSchema = z.object({
  message: z.string(),
  mealPlan: z.array(mealSchema),
  estimatedTotal: z.number(),
  estimatedSavings: z.number(),
  budget: z.number().optional(),
});

export type MealIngredient = z.infer<typeof mealIngredientSchema>;
export type Meal = z.infer<typeof mealSchema>;
export type MealPlanResponse = z.infer<typeof mealPlanResponseSchema>;
