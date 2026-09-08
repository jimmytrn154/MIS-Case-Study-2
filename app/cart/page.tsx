import { ShoppingCart, Store } from "lucide-react";
import { sampleCartItems } from "@/data/cart";
import { getCartLines, getCartSubtotal } from "@/lib/cart";
import { currentStore } from "@/data/store";

export default function CartPage() {
  const lines = getCartLines(sampleCartItems);
  const subtotal = getCartSubtotal(lines);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-5 w-5 text-zinc-700" strokeWidth={1.75} />
        <h1 className="text-2xl font-semibold text-zinc-900">Cart</h1>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white p-4">
        <ul className="divide-y divide-zinc-100">
          {lines.map((line) => (
            <li
              key={line.product.id}
              className="flex items-center gap-3 py-3"
            >
              <span
                aria-hidden
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl"
              >
                {line.product.image}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900">
                  {line.product.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {line.product.unit} · Qty {line.quantity}
                </p>
              </div>
              <span className="text-sm font-semibold text-zinc-900">
                ${line.lineTotal.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3 text-base font-semibold text-zinc-900">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
        <Store className="h-5 w-5 shrink-0" strokeWidth={1.75} />
        Pickup at {currentStore.name} · {currentStore.hoursLabel}
      </div>

      <button
        type="button"
        className="w-full rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        Reserve for pickup
      </button>
      <p className="text-center text-xs text-zinc-400">
        This is a simulated reservation — no order is actually placed.
      </p>
    </div>
  );
}
