import type { CartItem, Product } from "../types/grocery.ts";
import type { PantryItem, PantryStatus } from "../types/intelligence.ts";

function parseIsoDay(value: string): number {
  const [year, month, day] = value.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export function getPantryDaysRemaining(expiresAt: string, today: string): number {
  return Math.round((parseIsoDay(expiresAt) - parseIsoDay(today)) / 86_400_000);
}

/** Expiration safety takes precedence over low-stock labeling. */
export function getPantryStatus(item: PantryItem, today: string): PantryStatus {
  if (item.quantity === 0) return "low-stock";
  if (item.expiresAt) {
    const daysRemaining = getPantryDaysRemaining(item.expiresAt, today);
    if (daysRemaining < 0) return "expired";
    if (daysRemaining <= 3) return "use-soon";
  }
  if (item.quantity <= item.lowStockThreshold) return "low-stock";
  return "fresh";
}

export function withCalculatedPantryStatus(
  items: PantryItem[],
  today: string,
): PantryItem[] {
  return items.map((item) => ({ ...item, status: getPantryStatus(item, today) }));
}

export function buildPurchasedPantryItems({
  cartItems,
  catalog,
  customerId,
  purchasedAt,
  makeId,
}: {
  cartItems: CartItem[];
  catalog: Product[];
  customerId: string;
  purchasedAt: string;
  makeId: (productId: string) => string;
}): PantryItem[] {
  const productById = new Map(catalog.map((product) => [product.id, product]));

  return cartItems.flatMap((cartItem) => {
    const product = productById.get(cartItem.productId);
    if (!product || cartItem.quantity <= 0) return [];
    const multiplier = product.pantryUnitsPerPurchase ?? 1;
    const quantity = Math.round(cartItem.quantity * multiplier * 100) / 100;
    const item: PantryItem = {
      id: makeId(product.id),
      customerId,
      productId: product.id,
      quantity,
      unit: product.pantryUnit ?? product.unit,
      purchasedAt,
      expiresAt: product.expirationDate ?? product.sellByDate,
      lowStockThreshold: Math.round(multiplier * 0.2 * 100) / 100,
      status: "fresh",
    };
    return [item];
  });
}

export function consumePantryItems(
  items: PantryItem[],
  deductions: { pantryItemId: string; quantity: number }[],
  today: string,
): PantryItem[] {
  const deductionById = new Map<string, number>();
  for (const deduction of deductions) {
    if (deduction.quantity <= 0) continue;
    deductionById.set(
      deduction.pantryItemId,
      (deductionById.get(deduction.pantryItemId) ?? 0) + deduction.quantity,
    );
  }

  return withCalculatedPantryStatus(
    items.map((item) => {
      const deduction = deductionById.get(item.id) ?? 0;
      return {
        ...item,
        quantity: Math.max(0, Math.round((item.quantity - deduction) * 100) / 100),
      };
    }),
    today,
  );
}
