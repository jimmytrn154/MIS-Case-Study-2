import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { sampleCartItems } from "@/data/cart";
import { getCartLines, getCartSubtotal } from "@/lib/cart";

export default function CartSummaryPanel() {
  const lines = getCartLines(sampleCartItems);
  const subtotal = getCartSubtotal(lines);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-4">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-4 w-4 text-zinc-700" strokeWidth={1.75} />
        <h2 className="text-sm font-semibold text-zinc-900">Your cart</h2>
        <span className="ml-auto text-xs text-zinc-500">
          {itemCount} items
        </span>
      </div>

      <ul className="mt-3 space-y-2">
        {lines.map((line) => (
          <li
            key={line.product.id}
            className="flex items-center justify-between text-xs text-zinc-600"
          >
            <span className="flex items-center gap-2">
              <span aria-hidden className="text-base">
                {line.product.emoji}
              </span>
              {line.product.name} × {line.quantity}
            </span>
            <span className="font-medium text-zinc-900">
              ${line.lineTotal.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3 text-sm font-semibold text-zinc-900">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <Link
        href="/cart"
        className="mt-3 flex w-full items-center justify-center rounded-full border border-zinc-200 py-2 text-sm font-semibold text-zinc-700 hover:border-emerald-300 hover:text-emerald-700"
      >
        Review cart
      </Link>
    </div>
  );
}
