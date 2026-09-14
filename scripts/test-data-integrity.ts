import assert from "node:assert/strict";
import { DEMO_TODAY } from "../data/demo-date.ts";
import { farms } from "../data/farms.ts";
import { initialPantryItems } from "../data/pantry.ts";
import { products } from "../data/products.ts";
import { purchaseHistory } from "../data/purchase-history.ts";
import { storeAisles } from "../data/store-aisles.ts";

const productIds = new Set(products.map((product) => product.id));
const farmIds = new Set(farms.map((farm) => farm.id));
const aisleIds = new Set(storeAisles.map((aisle) => aisle.id));

assert.equal(productIds.size, products.length, "Product ids must be unique");
assert.equal(farmIds.size, farms.length, "Farm ids must be unique");
assert.equal(aisleIds.size, storeAisles.length, "Aisle ids must be unique");

for (const product of products) {
  assert(aisleIds.has(product.storeLocation.aisleId), `${product.id} has an unknown aisle`);
  assert(
    !(product.expirationDate && product.sellByDate),
    `${product.id} should use one freshness date type`,
  );
  if (product.farmId) {
    assert(farmIds.has(product.farmId), `${product.id} has an unknown farm`);
    assert(
      product.harvestDate || product.productionDate,
      `${product.id} needs a harvest or production date for traceability`,
    );
  }
}

for (const purchase of purchaseHistory) {
  assert(productIds.has(purchase.productId), `${purchase.id} has an unknown product`);
  assert(purchase.purchasedAt <= DEMO_TODAY, `${purchase.id} occurs after the demo date`);
  assert(purchase.quantity > 0, `${purchase.id} must have a positive quantity`);
}

for (const item of initialPantryItems) {
  assert(productIds.has(item.productId), `${item.id} has an unknown product`);
  assert(item.quantity >= 0, `${item.id} cannot have a negative quantity`);
  assert(item.lowStockThreshold >= 0, `${item.id} needs a valid low-stock threshold`);
}

assert(products.some((product) => product.id === "chicken-breast" && product.sellByDate === "2026-09-15"));
assert(products.some((product) => product.id === "honeycrisp-apples" && product.farmId === "green-valley-orchard"));
assert(initialPantryItems.some((item) => item.productId === "whole-milk" && item.quantity === 2));
assert(initialPantryItems.some((item) => item.productId === "large-eggs" && item.quantity === 0));

console.log(`Data integrity passed: ${products.length} products, ${purchaseHistory.length} purchases, ${initialPantryItems.length} pantry items, ${farms.length} demo farms, ${storeAisles.length} store zones.`);
