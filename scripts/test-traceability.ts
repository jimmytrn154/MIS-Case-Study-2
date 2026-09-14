import assert from "node:assert/strict";
import { farms } from "../data/farms.ts";
import { products } from "../data/products.ts";
import { buildTraceabilityRecord } from "../lib/traceability-core.ts";

const traceableProducts = products.filter((product) => product.farmId);
assert(traceableProducts.length >= 5, "The demo needs several traceable local products");

for (const product of traceableProducts) {
  const record = buildTraceabilityRecord(product.id, products, farms);
  assert(record, `${product.id} should resolve a traceability record`);
  assert(record.originDate, `${product.id} should have a structured origin date`);
}

const apples = buildTraceabilityRecord("honeycrisp-apples", products, farms);
assert(apples);
assert.equal(apples.farmId, "green-valley-orchard");
assert.equal(apples.originDate, "2026-09-10");
assert.equal(apples.originDateType, "harvested");

const orchard = farms.find((farm) => farm.id === apples.farmId);
assert(orchard);
assert.equal(orchard.distanceFromStoreKm, 18);
assert.equal(orchard.isDemo, true);

assert.equal(buildTraceabilityRecord("paper-towels", products, farms), null);
assert.equal(buildTraceabilityRecord("not-real", products, farms), null);

console.log(`Traceability passed: ${traceableProducts.length} products across ${farms.length} fictional farms.`);
