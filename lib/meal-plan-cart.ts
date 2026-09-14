import { products } from "@/data/products";
import {
  getEffectivePrice,
  getItemSubtotal,
  getItemOriginalSubtotal,
  getItemSavings,
} from "@/lib/cart";
import type { CartItem, Product } from "@/types/grocery";
import type { Meal } from "@/types/meal-plan";

export interface ConsolidatedLine {
  product: Product;
  /** Total quantity requested across every meal in the plan, before any stock cap. */
  requestedQuantity: number;
  /** How much can actually be added given current stock and what's already in the cart. */
  quantity: number;
  unitPrice: number;
  originalUnitPrice: number;
  lineCost: number;
  originalLineCost: number;
  savings: number;
  exceedsStock: boolean;
}

export interface ShoppingList {
  lines: ConsolidatedLine[];
  regularTotal: number;
  freshWaveTotal: number;
  totalSavings: number;
}

/**
 * Merges every ingredient across every meal in a plan into a single
 * product -> quantity map, summing duplicate products (e.g. chicken breast
 * appearing in both Monday's and Tuesday's dinner consolidates into one
 * entry with the combined quantity).
 */
export function consolidateMealPlanIngredients(mealPlan: Meal[]): Map<string, number> {
  const totals = new Map<string, number>();
  for (const meal of mealPlan) {
    for (const ingredient of meal.ingredients) {
      totals.set(
        ingredient.productId,
        (totals.get(ingredient.productId) ?? 0) + ingredient.quantity,
      );
    }
  }
  return totals;
}

/**
 * Builds the priced, stock-checked shopping list for a consolidated meal
 * plan. `cartItems` (the customer's current cart) is factored in so the
 * displayed cap and warning reflect what will actually fit — not just raw
 * product stock — matching what addShoppingListToCart will really do.
 */
export function buildShoppingList(
  mealPlan: Meal[],
  cartItems: CartItem[] = [],
): ShoppingList {
  const requested = consolidateMealPlanIngredients(mealPlan);
  const cartQuantities = new Map(cartItems.map((item) => [item.productId, item.quantity]));

  const lines: ConsolidatedLine[] = [];
  for (const [productId, requestedQuantity] of requested) {
    const product = products.find((p) => p.id === productId);
    if (!product) continue;

    const alreadyInCart = cartQuantities.get(productId) ?? 0;
    const availableRoom = Math.max(0, product.stock - alreadyInCart);
    const quantity = Math.min(requestedQuantity, availableRoom);

    lines.push({
      product,
      requestedQuantity,
      quantity,
      unitPrice: getEffectivePrice(product),
      originalUnitPrice: product.originalPrice ?? product.price,
      lineCost: getItemSubtotal(product, quantity),
      originalLineCost: getItemOriginalSubtotal(product, quantity),
      savings: getItemSavings(product, quantity),
      exceedsStock: requestedQuantity > availableRoom,
    });
  }

  return {
    lines,
    regularTotal: lines.reduce((sum, line) => sum + line.originalLineCost, 0),
    freshWaveTotal: lines.reduce((sum, line) => sum + line.lineCost, 0),
    totalSavings: lines.reduce((sum, line) => sum + line.savings, 0),
  };
}

/**
 * Adds every line's requested quantity to the cart. Passes the raw
 * requested amount (not the pre-capped display quantity) — the cart's own
 * addItem is the single source of truth for stock capping against
 * whatever is already in the cart at the moment of adding.
 */
export function addShoppingListToCart(
  lines: ConsolidatedLine[],
  addItem: (productId: string, quantity: number) => void,
) {
  for (const line of lines) {
    if (line.requestedQuantity > 0) {
      addItem(line.product.id, line.requestedQuantity);
    }
  }
}
