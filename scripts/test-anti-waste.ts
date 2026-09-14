import assert from "node:assert/strict";
import { DEMO_TODAY } from "../data/demo-date.ts";
import { products } from "../data/products.ts";
import { purchaseHistory } from "../data/purchase-history.ts";
import {
  buildAntiWasteOffers,
  getAntiWasteDiscountPercent,
  getDaysRemaining,
} from "../lib/anti-waste-core.ts";

assert.equal(getAntiWasteDiscountPercent(4), 0);
assert.equal(getAntiWasteDiscountPercent(3), 15);
assert.equal(getAntiWasteDiscountPercent(2), 25);
assert.equal(getAntiWasteDiscountPercent(1), 35);
assert.equal(getAntiWasteDiscountPercent(0), 40);
assert.equal(getAntiWasteDiscountPercent(-1), 0);
assert.equal(getDaysRemaining("2026-09-15", DEMO_TODAY), 1);

const offers = buildAntiWasteOffers({
  catalog: products,
  history: purchaseHistory,
  customerId: "sarah",
  customerName: "Sarah",
  today: DEMO_TODAY,
});

const chicken = offers.find((offer) => offer.productId === "chicken-breast");
assert(chicken, "Chicken should have an anti-waste offer");
assert.equal(chicken.discountPercent, 35);
assert.equal(chicken.discountedPrice, 3.57);
assert.equal(chicken.personalized, true);
assert.equal(chicken.recommendationReason, "Sarah buys this regularly");

const milk = offers.find((offer) => offer.productId === "whole-milk");
assert(milk, "Milk should enter the three-day anti-waste window");
assert.equal(milk.discountPercent, 15);
assert.equal(milk.personalized, true);

assert(!offers.some((offer) => offer.productId === "large-eggs"), "Eggs are outside the window");
assert(!offers.some((offer) => offer.daysRemaining < 0), "Expired products must be excluded");

const firstNonPersonalized = offers.findIndex((offer) => !offer.personalized);
assert(
  firstNonPersonalized === -1 || offers.slice(0, firstNonPersonalized).every((offer) => offer.personalized),
  "Personalized offers should be ranked first",
);

console.log(`Anti-waste logic passed: ${offers.length} active offers, ${offers.filter((offer) => offer.personalized).length} personalized.`);
