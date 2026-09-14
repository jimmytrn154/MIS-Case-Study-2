import type { Farm, TraceabilityRecord } from "../types/intelligence.ts";
import type { Product } from "../types/grocery.ts";

export function buildTraceabilityRecord(
  productId: string,
  catalog: Product[],
  farms: Farm[],
): TraceabilityRecord | null {
  const product = catalog.find((candidate) => candidate.id === productId);
  if (!product?.farmId) return null;

  const farm = farms.find((candidate) => candidate.id === product.farmId);
  const originDate = product.harvestDate ?? product.productionDate;
  if (!farm || !originDate) return null;

  return {
    productId: product.id,
    farmId: farm.id,
    originDate,
    originDateType: product.harvestDate ? "harvested" : "produced",
  };
}
