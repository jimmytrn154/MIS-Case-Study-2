"use client";

import { useState } from "react";
import Link from "next/link";
import { ListPlus, CheckCircle2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { buildShoppingList, addShoppingListToCart } from "@/lib/meal-plan-cart";
import { formatQuantity } from "@/lib/format";
import type { Meal } from "@/types/meal-plan";

export default function MealPlanShoppingList({ mealPlan }: { mealPlan: Meal[] }) {
  const { items, addItem } = useCart();
  const [added, setAdded] = useState(false);

  const shoppingList = buildShoppingList(mealPlan, items);
  const { lines, regularTotal, freshWaveTotal, totalSavings } = shoppingList;

  if (lines.length === 0) return null;

  function handleAddToCart() {
    addShoppingListToCart(lines, addItem);
    setAdded(true);
  }

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-4">
      <div className="flex items-center gap-2">
        <ListPlus className="h-4 w-4 text-zinc-700" strokeWidth={1.75} />
        <h3 className="text-sm font-semibold text-zinc-900">
          Shopping list for this plan
        </h3>
      </div>
      <p className="mt-0.5 text-xs text-zinc-500">
        Duplicate ingredients across meals are combined into one line.
      </p>

      <ul className="mt-3 divide-y divide-zinc-100">
        {lines.map((line) => (
          <li key={line.product.id} className="flex items-center gap-3 py-2.5">
            <span aria-hidden className="text-xl">
              {line.product.image}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-900">
                {line.product.name}
              </p>
              <p className="text-xs text-zinc-500">
                {line.product.unit} · Qty {formatQuantity(line.requestedQuantity)}
                {line.originalUnitPrice > line.unitPrice ? (
                  <span className="ml-1 text-zinc-400 line-through">
                    ${line.originalUnitPrice.toFixed(2)}
                  </span>
                ) : null}{" "}
                ${line.unitPrice.toFixed(2)} each
              </p>
              {line.exceedsStock ? (
                <p className="text-xs text-amber-600">
                  Only {formatQuantity(line.quantity)} available — capped from{" "}
                  {formatQuantity(line.requestedQuantity)}
                </p>
              ) : null}
            </div>
            <span className="shrink-0 text-sm font-semibold text-zinc-900">
              ${line.lineCost.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-3 space-y-1 border-t border-zinc-100 pt-3 text-sm">
        <div className="flex items-center justify-between text-zinc-500">
          <span>Regular total</span>
          <span>${regularTotal.toFixed(2)}</span>
        </div>
        {totalSavings > 0 ? (
          <div className="flex items-center justify-between text-emerald-700">
            <span>Total savings</span>
            <span>−${totalSavings.toFixed(2)}</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between text-base font-semibold text-zinc-900">
          <span>FreshWave total</span>
          <span>${freshWaveTotal.toFixed(2)}</span>
        </div>
      </div>

      {added ? (
        <div className="mt-3 flex items-center justify-between gap-2 rounded-full bg-emerald-50 py-2 pl-3 pr-1 text-sm font-medium text-emerald-700">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
            Added to cart
          </span>
          <Link
            href="/cart"
            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
          >
            View cart
          </Link>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-3 w-full rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Add meal plan to cart
        </button>
      )}
    </div>
  );
}
