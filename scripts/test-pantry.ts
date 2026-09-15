import assert from "node:assert/strict";
import { DEMO_TODAY } from "../data/demo-date.ts";
import { initialPantryItems } from "../data/pantry.ts";
import { products } from "../data/products.ts";
import {
  buildPurchasedPantryItems,
  consumePantryItems,
  getPantryStatus,
  withCalculatedPantryStatus,
} from "../lib/pantry-core.ts";
import { resolvePantryRecipe } from "../lib/pantry-recipe-core.ts";

const pantry = withCalculatedPantryStatus(initialPantryItems, DEMO_TODAY);
assert.equal(pantry.find((item) => item.productId === "broccoli")?.status, "use-soon");
assert.equal(pantry.find((item) => item.productId === "chicken-breast")?.status, "use-soon");
assert.equal(pantry.find((item) => item.productId === "whole-milk")?.status, "fresh");
assert.equal(pantry.find((item) => item.productId === "large-eggs")?.status, "low-stock");
assert.equal(
  getPantryStatus({ ...pantry[0], quantity: 1, expiresAt: "2026-09-13" }, DEMO_TODAY),
  "expired",
);

const purchased = buildPurchasedPantryItems({
  cartItems: [
    { productId: "large-eggs", quantity: 1 },
    { productId: "brown-rice", quantity: 2 },
    { productId: "not-real", quantity: 1 },
  ],
  catalog: products,
  customerId: "sarah",
  purchasedAt: DEMO_TODAY,
  makeId: (productId) => `new-${productId}`,
});
assert.equal(purchased.length, 2);
assert.equal(purchased.find((item) => item.productId === "large-eggs")?.quantity, 12);
assert.equal(purchased.find((item) => item.productId === "large-eggs")?.unit, "eggs");
assert.equal(purchased.find((item) => item.productId === "brown-rice")?.quantity, 1814);
assert.equal(purchased.find((item) => item.productId === "brown-rice")?.unit, "g");

const cooked = consumePantryItems(
  pantry,
  [
    { pantryItemId: "pantry-chicken", quantity: 5 },
    { pantryItemId: "pantry-rice", quantity: 200 },
  ],
  DEMO_TODAY,
);
assert.equal(cooked.find((item) => item.id === "pantry-chicken")?.quantity, 0);
assert.equal(cooked.find((item) => item.id === "pantry-chicken")?.status, "low-stock");
assert.equal(cooked.find((item) => item.id === "pantry-rice")?.quantity, 1000);
assert(cooked.every((item) => item.quantity >= 0));

const recipe = resolvePantryRecipe(
  {
    message: "Use the ingredients that need attention first.",
    name: "Chicken and broccoli rice bowl",
    summary: "A quick pantry meal.",
    ingredients: [
      { productId: "chicken-breast", quantity: 1 },
      { productId: "chicken-breast", quantity: 1 },
      { productId: "broccoli", quantity: 0.5 },
      { productId: "brown-rice", quantity: 200 },
      { productId: "not-real", quantity: 2 },
    ],
    instructions: ["Cook safely and combine."],
  },
  pantry,
  products,
);
assert.equal(
  recipe.recipe.ingredients.find((ingredient) => ingredient.productId === "chicken-breast")?.quantity,
  0.5,
  "Resolved recipe consumption cannot exceed pantry quantity",
);
assert(!recipe.recipe.ingredients.some((ingredient) => ingredient.productId === "not-real"));

console.log(`Virtual Pantry passed: ${pantry.length} items, purchase conversion, safe consumption, and grounded recipe resolution.`);
