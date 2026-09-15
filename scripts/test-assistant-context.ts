import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { products } from "../data/products.ts";
import { storeAisles } from "../data/store-aisles.ts";
import { formatAssistantIntelligenceContext } from "../lib/ai/intelligence-context.ts";
import type { AssistantStructuredContext } from "../types/assistant-context.ts";

const context: AssistantStructuredContext = {
  pantryItems: [
    {
      id: "test-milk",
      customerId: "sarah-chen",
      productId: "whole-milk",
      quantity: 2,
      unit: "cartons",
      purchasedAt: "2026-09-12",
      expiresAt: "2026-09-21",
      lowStockThreshold: 1,
      status: "fresh",
    },
  ],
  restockRecommendations: [
    {
      productId: "large-eggs",
      averagePurchaseIntervalDays: 7,
      predictedNextPurchaseAt: "2026-09-14",
      daysUntilRestock: 0,
      confidence: "high",
      reason: "The pantry is depleted.",
      pantryAdjusted: true,
      pantrySignal: "depleted",
    },
  ],
  restocksCoveredByPantry: [
    {
      productId: "whole-milk",
      averagePurchaseIntervalDays: 7,
      predictedNextPurchaseAt: "2026-09-15",
      daysUntilRestock: 1,
      confidence: "high",
      reason: "Current pantry quantity is sufficient.",
      pantryAdjusted: true,
      originalDaysUntilRestock: 1,
      pantrySignal: "sufficient-stock",
    },
  ],
  antiWasteOffers: [
    {
      id: "test-offer",
      productId: "chicken-breast",
      normalPrice: 6.99,
      discountedPrice: 4.54,
      discountPercent: 35,
      daysRemaining: 1,
      freshnessDate: "2026-09-15",
      freshnessDateType: "sell-by",
      personalized: true,
      recommendationReason: "Frequently purchased by Sarah.",
    },
  ],
  farms: [
    {
      id: "green-valley-orchard",
      name: "Green Valley Orchard",
      region: "North Riverside Hills",
      coordinates: { latitude: 34.094, longitude: -117.477 },
      description: "Fictional test producer.",
      productTypes: ["apples"],
      distanceFromStoreKm: 18,
      isDemo: true,
    },
  ],
  shoppingRoute: {
    storeId: "freshwave-riverside",
    source: "cart",
    stops: [
      {
        aisleId: "produce",
        productIds: ["honeycrisp-apples"],
        sequence: 1,
        collectedProductIds: [],
      },
    ],
  },
};

const formatted = formatAssistantIntelligenceContext(context, products, storeAisles);
assert.match(formatted, /quantity: 2 cartons/);
assert.match(formatted, /large-eggs .* days until restock: 0 .* pantry signal: depleted/);
assert.match(formatted, /whole-milk .* pantry signal: sufficient-stock/);
assert.match(formatted, /normal: \$6\.99 .* discounted: \$4\.54 .* discount: 35%/);
assert.match(formatted, /Green Valley Orchard .* harvested: 2026-09-10/);
assert.match(formatted, /Stop 1: Produce \(P\) .* Honeycrisp apples/);
assert.match(formatted, /no indoor GPS or live position/);

const promptSource = readFileSync(
  new URL("../lib/ai/system-prompt.ts", import.meta.url),
  "utf8",
);
for (const rule of [
  "Never invent pantry quantities",
  "Never invent expiry",
  "Never invent farms",
  "Never invent discounts",
  "Never invent aisle",
  "Never claim indoor GPS",
  "Application logic—not you—is authoritative",
]) {
  assert(promptSource.includes(rule), `System prompt must include: ${rule}`);
}

console.log("Assistant intelligence context tests passed.");
