import assert from "node:assert/strict";
import { products } from "../data/products.ts";
import { storeAisles } from "../data/store-aisles.ts";
import { buildShoppingRoute } from "../lib/store-routing-core.ts";

const route = buildShoppingRoute({
  items: [
    { productId: "paper-towels", quantity: 1 },
    { productId: "whole-milk", quantity: 1 },
    { productId: "bananas", quantity: 1 },
    { productId: "brown-rice", quantity: 1 },
    { productId: "chicken-breast", quantity: 1 },
    { productId: "spring-water", quantity: 1 },
  ],
  catalog: products,
  aisles: storeAisles,
  storeId: "riverside",
});

assert.deepEqual(
  route.stops.map((stop) => stop.aisleId),
  [
    "entrance",
    "produce",
    "meat-seafood",
    "dairy-eggs",
    "pantry",
    "drinks",
    "household",
    "checkout",
  ],
);
assert.deepEqual(route.stops.map((stop) => stop.sequence), [0, 1, 2, 3, 4, 5, 6, 7]);
assert.equal(route.storeId, "riverside");
assert.equal(route.source, "cart");
assert(route.stops.every((stop) => stop.collectedProductIds.length === 0));

const produceStop = route.stops.find((stop) => stop.aisleId === "produce");
assert.deepEqual(produceStop?.productIds, ["bananas"]);

const deduplicated = buildShoppingRoute({
  items: [
    { productId: "bananas", quantity: 1 },
    { productId: "bananas", quantity: 2 },
    { productId: "not-real", quantity: 1 },
    { productId: "whole-milk", quantity: 0 },
  ],
  catalog: products,
  aisles: storeAisles,
  storeId: "riverside",
});
assert.deepEqual(deduplicated.stops.map((stop) => stop.aisleId), ["entrance", "produce", "checkout"]);
assert.deepEqual(deduplicated.stops[1].productIds, ["bananas"]);

const empty = buildShoppingRoute({
  items: [],
  catalog: products,
  aisles: storeAisles,
  storeId: "riverside",
});
assert.deepEqual(empty.stops.map((stop) => stop.aisleId), ["entrance"]);

console.log(`Store routing passed: ${route.stops.length - 2} shopping sections plus entrance and checkout.`);
