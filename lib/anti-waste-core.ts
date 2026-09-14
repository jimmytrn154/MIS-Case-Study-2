import type { Product } from "../types/grocery.ts";
import type { AntiWasteOffer, PurchaseHistory } from "../types/intelligence.ts";

export const ANTI_WASTE_WINDOW_DAYS = 3;

/** Explainable markdown ladder: 3 days 15%, 2 days 25%, 1 day 35%, today 40%. */
export function getAntiWasteDiscountPercent(daysRemaining: number): number {
  if (daysRemaining === 3) return 15;
  if (daysRemaining === 2) return 25;
  if (daysRemaining === 1) return 35;
  if (daysRemaining === 0) return 40;
  return 0;
}

function parseIsoDay(value: string): number {
  const [year, month, day] = value.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export function getDaysRemaining(freshnessDate: string, today: string): number {
  return Math.round((parseIsoDay(freshnessDate) - parseIsoDay(today)) / 86_400_000);
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function buildAntiWasteOffers({
  catalog,
  history,
  customerId,
  customerName,
  today,
}: {
  catalog: Product[];
  history: PurchaseHistory[];
  customerId: string;
  customerName: string;
  today: string;
}): AntiWasteOffer[] {
  const purchaseCounts = new Map<string, number>();
  for (const purchase of history) {
    if (purchase.customerId !== customerId) continue;
    purchaseCounts.set(
      purchase.productId,
      (purchaseCounts.get(purchase.productId) ?? 0) + 1,
    );
  }

  return catalog
    .flatMap((product): AntiWasteOffer[] => {
      if (!product.isPerishable || product.stock <= 0) return [];

      const freshnessDate = product.sellByDate ?? product.expirationDate;
      if (!freshnessDate) return [];

      const daysRemaining = getDaysRemaining(freshnessDate, today);
      const discountPercent = getAntiWasteDiscountPercent(daysRemaining);
      if (discountPercent === 0) return [];

      const personalized = (purchaseCounts.get(product.id) ?? 0) >= 3;
      const freshnessDateType = product.sellByDate ? "sell-by" : "expiration";

      return [
        {
          id: `anti-waste-${product.id}-${freshnessDate}`,
          productId: product.id,
          normalPrice: product.price,
          discountedPrice: roundCurrency(product.price * (1 - discountPercent / 100)),
          discountPercent,
          daysRemaining,
          freshnessDate,
          freshnessDateType,
          personalized,
          recommendationReason: personalized
            ? `${customerName} buys this regularly`
            : `Marked down because its ${freshnessDateType} date is approaching`,
        },
      ];
    })
    .sort(
      (a, b) =>
        Number(b.personalized) - Number(a.personalized) ||
        a.daysRemaining - b.daysRemaining ||
        b.discountPercent - a.discountPercent ||
        a.productId.localeCompare(b.productId),
    );
}
