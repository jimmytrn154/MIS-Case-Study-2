import assert from "node:assert/strict";
import { DEMO_TODAY } from "../data/demo-date.ts";
import { initialPantryItems } from "../data/pantry.ts";
import { purchaseHistory } from "../data/purchase-history.ts";
import { adjustRestockPredictionsWithPantry } from "../lib/pantry-restock-core.ts";
import { withCalculatedPantryStatus } from "../lib/pantry-core.ts";
import { buildRestockPredictions } from "../lib/restock-prediction-core.ts";

const predictions = buildRestockPredictions({
  history: purchaseHistory,
  customerId: "sarah",
  today: DEMO_TODAY,
});
const pantry = withCalculatedPantryStatus(initialPantryItems, DEMO_TODAY);
const adjusted = adjustRestockPredictionsWithPantry(predictions, pantry);

assert(
  !adjusted.recommendations.some((prediction) => prediction.productId === "whole-milk"),
  "Two cartons of milk should suppress the immediate historical prediction",
);
const coveredMilk = adjusted.coveredByPantry.find(
  (prediction) => prediction.productId === "whole-milk",
);
assert(coveredMilk);
assert.equal(coveredMilk.pantrySignal, "sufficient-stock");
assert.match(coveredMilk.reason, /still has 2 cartons/);

const eggs = adjusted.recommendations.find(
  (prediction) => prediction.productId === "large-eggs",
);
assert(eggs);
assert.equal(eggs.pantrySignal, "depleted");
assert(eggs.daysUntilRestock <= 0);

const paperTowels = adjusted.recommendations.find(
  (prediction) => prediction.productId === "paper-towels",
);
assert(paperTowels);
assert.equal(paperTowels.pantrySignal, "low-stock");
assert.equal(paperTowels.daysUntilRestock, 0);

assert.deepEqual(
  adjusted.recommendations.map((prediction) => prediction.productId),
  ["large-eggs", "chicken-breast", "paper-towels", "bananas"],
);

console.log(`Cross-feature restock passed: ${adjusted.recommendations.length} recommended, ${adjusted.coveredByPantry.length} suppressed by pantry stock.`);
