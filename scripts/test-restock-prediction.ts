import assert from "node:assert/strict";
import { DEMO_TODAY } from "../data/demo-date.ts";
import { purchaseHistory } from "../data/purchase-history.ts";
import {
  buildRestockPredictions,
  isLikelyRunningLow,
} from "../lib/restock-prediction-core.ts";

const predictions = buildRestockPredictions({
  history: purchaseHistory,
  customerId: "sarah",
  today: DEMO_TODAY,
});

const byProduct = new Map(predictions.map((prediction) => [prediction.productId, prediction]));

const milk = byProduct.get("whole-milk");
assert(milk);
assert.equal(milk.averagePurchaseIntervalDays, 7);
assert.equal(milk.predictedNextPurchaseAt, "2026-09-15");
assert.equal(milk.daysUntilRestock, 1);
assert.equal(milk.confidence, "high");

const eggs = byProduct.get("large-eggs");
assert(eggs);
assert.equal(eggs.averagePurchaseIntervalDays, 10);
assert.equal(eggs.daysUntilRestock, -3);
assert.equal(eggs.confidence, "high");

const paperTowels = byProduct.get("paper-towels");
assert(paperTowels);
assert.equal(paperTowels.averagePurchaseIntervalDays, 25);
assert.equal(paperTowels.daysUntilRestock, 7);
assert.equal(paperTowels.confidence, "medium");

const likelyRunningLow = predictions.filter(isLikelyRunningLow);
assert.deepEqual(
  likelyRunningLow.map((prediction) => prediction.productId),
  ["large-eggs", "chicken-breast", "bananas", "whole-milk", "paper-towels"],
);
assert(predictions.every((prediction) => prediction.pantryAdjusted === false));

const sparse = buildRestockPredictions({
  history: purchaseHistory.slice(0, 1),
  customerId: "sarah",
  today: DEMO_TODAY,
});
assert.equal(sparse.length, 0, "One purchase is insufficient to estimate an interval");

console.log(`Smart Fridge prediction passed: ${predictions.length} predictions, ${likelyRunningLow.length} likely running low.`);
