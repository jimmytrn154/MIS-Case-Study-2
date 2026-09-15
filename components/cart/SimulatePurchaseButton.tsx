"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, PackageCheck } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useCart } from "@/components/cart/CartProvider";
import { usePantry } from "@/components/pantry/PantryProvider";

export default function SimulatePurchaseButton() {
  const { items, clearCart } = useCart();
  const { addPurchasedItems } = usePantry();
  const [confirming, setConfirming] = useState(false);
  const [completed, setCompleted] = useState(false);

  function simulatePurchase() {
    addPurchasedItems(items);
    clearCart();
    setConfirming(false);
    setCompleted(true);
  }

  if (completed) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <span className="flex-1">Demo purchase added to your Virtual Pantry.</span>
        <Link href="/my-kitchen/pantry" className="font-semibold underline underline-offset-2">
          View pantry
        </Link>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        disabled={items.length === 0}
        onClick={() => setConfirming(true)}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        <PackageCheck className="h-4 w-4" /> Simulate completed purchase
      </button>
      <p className="text-center text-xs text-zinc-400">
        Demonstration only—no payment or real order is processed.
      </p>

      <Modal open={confirming} onClose={() => setConfirming(false)} title="Add purchased items to pantry?">
        <p className="text-sm leading-6 text-zinc-600">
          This prototype action will move {items.length} cart {items.length === 1 ? "line" : "lines"} into Sarah&apos;s Virtual Pantry and clear the cart.
        </p>
        <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs font-medium text-amber-700">
          No payment will be taken and no retailer order will be created.
        </p>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => setConfirming(false)} className="min-h-11 flex-1 rounded-full border border-zinc-200 text-sm font-semibold text-zinc-700">
            Cancel
          </button>
          <button type="button" onClick={simulatePurchase} className="min-h-11 flex-1 rounded-full bg-violet-600 text-sm font-semibold text-white hover:bg-violet-700">
            Confirm simulation
          </button>
        </div>
      </Modal>
    </>
  );
}
