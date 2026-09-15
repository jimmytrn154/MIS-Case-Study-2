import type { Product } from "../../types/grocery.ts";
import type { AssistantStructuredContext } from "../../types/assistant-context.ts";
import type { StoreAisle } from "../../types/intelligence.ts";

function money(value: number): string {
  return `$${value.toFixed(2)}`;
}

/**
 * Serializes application-calculated intelligence for Gemini. Keeping this
 * formatter pure makes the exact grounding payload independently testable.
 */
export function formatAssistantIntelligenceContext(
  context: AssistantStructuredContext,
  catalog: Product[],
  aisles: StoreAisle[],
): string {
  const productById = new Map(catalog.map((product) => [product.id, product]));
  const aisleById = new Map(aisles.map((aisle) => [aisle.id, aisle]));

  const pantry = context.pantryItems.length
    ? context.pantryItems
        .map((item) => {
          const product = productById.get(item.productId);
          return `- ${item.productId} | ${product?.name ?? "Unknown product"} | quantity: ${item.quantity} ${item.unit} | status: ${item.status} | purchased: ${item.purchasedAt} | expires: ${item.expiresAt ?? "not supplied"}`;
        })
        .join("\n")
    : "- No Virtual Pantry items were supplied for this request.";

  const recommendations = context.restockRecommendations.length
    ? context.restockRecommendations
        .map((prediction) => {
          const product = productById.get(prediction.productId);
          return `- ${prediction.productId} | ${product?.name ?? "Unknown product"} | predicted date: ${prediction.predictedNextPurchaseAt} | days until restock: ${prediction.daysUntilRestock} | confidence: ${prediction.confidence} | pantry signal: ${prediction.pantrySignal ?? "none"} | reason: ${prediction.reason}`;
        })
        .join("\n")
    : "- No current restock recommendations.";

  const covered = context.restocksCoveredByPantry.length
    ? context.restocksCoveredByPantry
        .map((prediction) => {
          const product = productById.get(prediction.productId);
          return `- ${prediction.productId} | ${product?.name ?? "Unknown product"} | original days until restock: ${prediction.originalDaysUntilRestock ?? prediction.daysUntilRestock} | pantry signal: ${prediction.pantrySignal ?? "sufficient-stock"} | reason: ${prediction.reason}`;
        })
        .join("\n")
    : "- No predictions are currently covered by pantry stock.";

  const offers = context.antiWasteOffers.length
    ? context.antiWasteOffers
        .map((offer) => {
          const product = productById.get(offer.productId);
          return `- ${offer.productId} | ${product?.name ?? "Unknown product"} | normal: ${money(offer.normalPrice)} | discounted: ${money(offer.discountedPrice)} | discount: ${offer.discountPercent}% | ${offer.freshnessDateType}: ${offer.freshnessDate} | days remaining: ${offer.daysRemaining} | personalized: ${offer.personalized ? "yes" : "no"} | reason: ${offer.recommendationReason}`;
        })
        .join("\n")
    : "- No current anti-waste offers.";

  const producerLines = catalog
    .filter((product) => product.farmId)
    .map((product) => {
      const farm = context.farms.find((candidate) => candidate.id === product.farmId);
      if (!farm) return null;
      const originDate = product.harvestDate ?? product.productionDate;
      const originType = product.harvestDate ? "harvested" : "produced";
      return `- ${product.id} | ${product.name} | farm: ${farm.name} | region: ${farm.region} | distance: ${farm.distanceFromStoreKm} km | ${originType}: ${originDate ?? "not supplied"} | fictional demo producer: yes`;
    })
    .filter((line): line is string => line !== null);
  const producers = producerLines.length
    ? producerLines.join("\n")
    : "- No producer relationships were supplied.";

  const route = context.shoppingRoute.stops.length
    ? context.shoppingRoute.stops
        .map((stop) => {
          const aisle = aisleById.get(stop.aisleId);
          const names = stop.productIds.map(
            (productId) => productById.get(productId)?.name ?? productId,
          );
          return `- Stop ${stop.sequence}: ${aisle?.name ?? stop.aisleId} (${aisle?.code ?? stop.aisleId}) | products: ${names.join(", ")}`;
        })
        .join("\n")
    : "- The current cart has no aisle route stops.";

  return [
    `Virtual Pantry (customer-reported structured state):\n${pantry}`,
    `Pantry-aware restock recommendations (application-calculated):\n${recommendations}`,
    `Historical predictions currently covered by pantry stock:\n${covered}`,
    `Smart anti-waste offers (application-calculated):\n${offers}`,
    `Local producer relationships (fictional prototype data):\n${producers}`,
    `Current cart aisle route (schematic guidance only; no indoor GPS or live position):\n${route}`,
  ].join("\n\n");
}
