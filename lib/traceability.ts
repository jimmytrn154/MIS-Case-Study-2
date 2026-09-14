import { farms } from "@/data/farms";
import { products } from "@/data/products";
import { buildTraceabilityRecord } from "@/lib/traceability-core";

export { buildTraceabilityRecord } from "@/lib/traceability-core";

export function getTraceabilityRecord(productId: string) {
  return buildTraceabilityRecord(productId, products, farms);
}
