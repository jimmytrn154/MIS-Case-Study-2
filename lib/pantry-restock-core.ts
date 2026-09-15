import type {
  PantryAwareRestockResult,
  PantryItem,
  RestockPrediction,
} from "../types/intelligence.ts";
import { LIKELY_RUNNING_LOW_DAYS } from "./restock-prediction-core.ts";

/**
 * Combines behavioral predictions with explicit home inventory. Sufficient
 * pantry stock suppresses near-term predictions; empty or threshold-level
 * stock promotes a product to "needed now". No language model is involved.
 */
export function adjustRestockPredictionsWithPantry(
  predictions: RestockPrediction[],
  pantryItems: PantryItem[],
): PantryAwareRestockResult {
  const pantryByProduct = new Map<string, PantryItem[]>();
  for (const item of pantryItems) {
    const batches = pantryByProduct.get(item.productId) ?? [];
    batches.push(item);
    pantryByProduct.set(item.productId, batches);
  }

  const recommendations: RestockPrediction[] = [];
  const coveredByPantry: RestockPrediction[] = [];

  for (const prediction of predictions) {
    const batches = pantryByProduct.get(prediction.productId);
    if (!batches?.length) {
      if (prediction.daysUntilRestock <= LIKELY_RUNNING_LOW_DAYS) {
        recommendations.push(prediction);
      }
      continue;
    }

    const totalQuantity = batches.reduce((sum, item) => sum + item.quantity, 0);
    const lowStockThreshold = Math.max(
      ...batches.map((item) => item.lowStockThreshold),
    );
    const originalDaysUntilRestock = prediction.daysUntilRestock;

    if (totalQuantity === 0) {
      recommendations.push({
        ...prediction,
        daysUntilRestock: Math.min(prediction.daysUntilRestock, 0),
        reason: `${prediction.reason}; Virtual Pantry is empty, so recommend now`,
        pantryAdjusted: true,
        originalDaysUntilRestock,
        pantrySignal: "depleted",
      });
      continue;
    }

    if (totalQuantity <= lowStockThreshold) {
      recommendations.push({
        ...prediction,
        daysUntilRestock: Math.min(prediction.daysUntilRestock, 0),
        reason: `${prediction.reason}; Virtual Pantry is at its low-stock threshold`,
        pantryAdjusted: true,
        originalDaysUntilRestock,
        pantrySignal: "low-stock",
      });
      continue;
    }

    if (prediction.daysUntilRestock <= LIKELY_RUNNING_LOW_DAYS) {
      coveredByPantry.push({
        ...prediction,
        reason: `${prediction.reason}; Virtual Pantry still has ${totalQuantity} ${batches[0].unit}`,
        pantryAdjusted: true,
        originalDaysUntilRestock,
        pantrySignal: "sufficient-stock",
      });
    }
  }

  recommendations.sort(
    (a, b) => a.daysUntilRestock - b.daysUntilRestock || a.productId.localeCompare(b.productId),
  );
  coveredByPantry.sort(
    (a, b) => a.daysUntilRestock - b.daysUntilRestock || a.productId.localeCompare(b.productId),
  );

  return { recommendations, coveredByPantry };
}
