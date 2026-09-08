"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";
import { getCartLines, getCartTotals } from "@/lib/cart";

export default function CartSummaryPanel() {
  const { items } = useCart();
  const lines = getCartLines(items);
  const totals = getCartTotals(lines);

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-4">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-4 w-4 text-zinc-700" strokeWidth={1.75} />
        <h2 className="text-sm font-semibold text-zinc-900">Your cart</h2>
        <span className="ml-auto text-xs text-zinc-500">
          {totals.itemCount} items
        </span>
      </div>

      {lines.length === 0 ? (
        <p className="mt-3 text-xs text-zinc-500">
          Your cart is empty. Add products to see them here.
        </p>
      ) : (
        <>
          <ul className="mt-3 space-y-2">
            {lines.map((line) => (
              <li
                key={line.product.id}
                className="flex items-center justify-between text-xs text-zinc-600"
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden className="text-base">
                    {line.product.image}
                  </span>
                  {line.product.name} × {line.quantity}
                </span>
                <span className="font-medium text-zinc-900">
                  ${line.subtotal.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          {totals.savings > 0 ? (
            <p className="mt-3 text-xs font-medium text-emerald-700">
              You&apos;re saving ${totals.savings.toFixed(2)}
            </p>
          ) : null}

          <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3 text-sm font-semibold text-zinc-900">
            <span>Subtotal</span>
            <span>${totals.subtotal.toFixed(2)}</span>
          </div>
        </>
      )}

      <Link
        href="/cart"
        className="mt-3 flex w-full items-center justify-center rounded-full border border-zinc-200 py-2 text-sm font-semibold text-zinc-700 hover:border-emerald-300 hover:text-emerald-700"
      >
        Review cart
      </Link>
    </div>
  );
}
