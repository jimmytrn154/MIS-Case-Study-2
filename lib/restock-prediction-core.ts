import type { PurchaseHistory, RestockConfidence, RestockPrediction } from "../types/intelligence.ts";

export const LIKELY_RUNNING_LOW_DAYS = 7;

function parseIsoDay(value: string): number {
  const [year, month, day] = value.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function formatIsoDay(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function daysBetween(earlier: string, later: string): number {
  return Math.round((parseIsoDay(later) - parseIsoDay(earlier)) / 86_400_000);
}

function confidenceFor(intervals: number[], purchaseCount: number): RestockConfidence {
  const average = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  const meanDeviation =
    intervals.reduce((sum, interval) => sum + Math.abs(interval - average), 0) /
    intervals.length;

  if (purchaseCount >= 4 && meanDeviation <= 1) return "high";
  if (purchaseCount >= 3 && meanDeviation <= 3) return "medium";
  return "low";
}

export function buildRestockPredictions({
  history,
  customerId,
  today,
}: {
  history: PurchaseHistory[];
  customerId: string;
  today: string;
}): RestockPrediction[] {
  const purchasesByProduct = new Map<string, PurchaseHistory[]>();

  for (const purchase of history) {
    if (purchase.customerId !== customerId) continue;
    const purchases = purchasesByProduct.get(purchase.productId) ?? [];
    purchases.push(purchase);
    purchasesByProduct.set(purchase.productId, purchases);
  }

  const predictions: RestockPrediction[] = [];

  for (const [productId, purchases] of purchasesByProduct) {
    if (purchases.length < 2) continue;
    const ordered = [...purchases].sort((a, b) =>
      a.purchasedAt.localeCompare(b.purchasedAt),
    );
    const intervals = ordered.slice(1).map((purchase, index) =>
      daysBetween(ordered[index].purchasedAt, purchase.purchasedAt),
    );
    const averagePurchaseIntervalDays =
      Math.round(
        (intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length) *
          10,
      ) / 10;
    const lastPurchase = ordered.at(-1)!;
    const predictedTimestamp =
      parseIsoDay(lastPurchase.purchasedAt) +
      Math.round(averagePurchaseIntervalDays) * 86_400_000;
    const predictedNextPurchaseAt = formatIsoDay(predictedTimestamp);
    const daysUntilRestock = daysBetween(today, predictedNextPurchaseAt);

    predictions.push({
      productId,
      averagePurchaseIntervalDays,
      predictedNextPurchaseAt,
      daysUntilRestock,
      confidence: confidenceFor(intervals, ordered.length),
      reason: `${ordered.length} purchases averaging every ${averagePurchaseIntervalDays} days`,
      pantryAdjusted: false,
    });
  }

  return predictions.sort(
    (a, b) => a.daysUntilRestock - b.daysUntilRestock || a.productId.localeCompare(b.productId),
  );
}

export function isLikelyRunningLow(prediction: RestockPrediction): boolean {
  return prediction.daysUntilRestock <= LIKELY_RUNNING_LOW_DAYS;
}
