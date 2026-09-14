"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPinned, ShoppingCart, Store } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import QuantityStepper from "@/components/ui/QuantityStepper";
import ReservePickupModal from "@/components/cart/ReservePickupModal";
import { getCartLines, getCartTotals } from "@/lib/cart";
import { currentStore } from "@/data/store";

export default function CartPage() {
  const { items, increment, decrement } = useCart();
  const lines = getCartLines(items);
  const totals = getCartTotals(lines);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-5 w-5 text-zinc-700" strokeWidth={1.75} />
        <h1 className="text-2xl font-semibold text-zinc-900">Cart</h1>
      </div>

      {lines.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
          Your cart is empty. Add products from the shop to see them here.
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-100 bg-white p-4">
          <ul className="divide-y divide-zinc-100">
            {lines.map((line) => (
              <li
                key={line.product.id}
                className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3"
              >
                <div className="flex min-w-[200px] flex-1 items-center gap-3">
                  <span
                    aria-hidden
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-2xl"
                  >
                    {line.product.image}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {line.product.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {line.product.unit} ·{" "}
                      {line.unitOriginalPrice > line.unitPrice ? (
                        <span className="text-zinc-400 line-through">
                          ${line.unitOriginalPrice.toFixed(2)}
                        </span>
                      ) : null}{" "}
                      ${line.unitPrice.toFixed(2)} each
                    </p>
                    {line.quantity >= line.product.stock ? (
                      <p className="text-xs text-amber-600">Max available in stock</p>
                    ) : null}
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <QuantityStepper
                    quantity={line.quantity}
                    onIncrement={() => increment(line.product.id)}
                    onDecrement={() => decrement(line.product.id)}
                    incrementDisabled={line.quantity >= line.product.stock}
                  />
                  <span className="w-16 shrink-0 text-right text-sm font-semibold text-zinc-900">
                    ${line.subtotal.toFixed(2)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-3 space-y-1 border-t border-zinc-100 pt-3 text-sm">
            <div className="flex items-center justify-between text-zinc-500">
              <span>Regular total</span>
              <span>${totals.originalSubtotal.toFixed(2)}</span>
            </div>
            {totals.savings > 0 ? (
              <div className="flex items-center justify-between text-emerald-700">
                <span>Total savings</span>
                <span>−${totals.savings.toFixed(2)}</span>
              </div>
            ) : null}
            <div className="flex items-center justify-between text-base font-semibold text-zinc-900">
              <span>FreshWave total</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
        <Store className="h-5 w-5 shrink-0" strokeWidth={1.75} />
        Pickup at {currentStore.name} · {currentStore.hoursLabel}
      </div>

      <Link
        href="/in-store-navigator"
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-5 text-sm font-semibold text-sky-700 hover:bg-sky-100"
      >
        <MapPinned className="h-4 w-4" /> Plan my in-store route
      </Link>

      <button
        type="button"
        disabled={lines.length === 0}
        onClick={() => setIsPickupModalOpen(true)}
        className="w-full rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        Reserve for pickup
      </button>
      <p className="text-center text-xs text-zinc-400">
        Demo only — this simulates a reservation, no order is actually placed.
      </p>

      <ReservePickupModal
        open={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
      />
    </div>
  );
}
