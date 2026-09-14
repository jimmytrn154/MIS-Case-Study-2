"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarClock,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingCart,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import Badge from "@/components/ui/Badge";
import type { Product } from "@/types/grocery";
import type { RestockPrediction } from "@/types/intelligence";

interface DraftLine {
  productId: string;
  quantity: number;
}

const CONFIDENCE_TONE = {
  high: "brand",
  medium: "info",
  low: "neutral",
} as const;

function timingLabel(days: number): string {
  if (days < 0) return `Likely needed now · predicted ${Math.abs(days)} days ago`;
  if (days === 0) return "Likely needed today";
  if (days === 1) return "Likely needed tomorrow";
  if (days <= 6) return `Likely needed in ${days} days`;
  if (days <= 9) return "Likely needed next week";
  return `Expected in about ${days} days`;
}

export default function SmartFridgeDashboard({
  predictions,
  catalog,
}: {
  predictions: RestockPrediction[];
  catalog: Product[];
}) {
  const { addItem } = useCart();
  const productById = useMemo(
    () => new Map(catalog.map((product) => [product.id, product])),
    [catalog],
  );
  const [selectedIds, setSelectedIds] = useState(
    () => new Set(predictions.map((prediction) => prediction.productId)),
  );
  const [draftLines, setDraftLines] = useState<DraftLine[] | null>(null);
  const [accepted, setAccepted] = useState(false);

  function toggleSelected(productId: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
    setAccepted(false);
  }

  function prepareDraft() {
    setDraftLines(
      predictions
        .filter((prediction) => selectedIds.has(prediction.productId))
        .map((prediction) => ({ productId: prediction.productId, quantity: 1 })),
    );
    setAccepted(false);
  }

  function changeDraftQuantity(productId: string, change: number) {
    setDraftLines((current) =>
      current
        ? current
            .map((line) =>
              line.productId === productId
                ? { ...line, quantity: Math.max(0, line.quantity + change) }
                : line,
            )
            .filter((line) => line.quantity > 0)
        : current,
    );
  }

  function removeDraftLine(productId: string) {
    setDraftLines((current) =>
      current?.filter((line) => line.productId !== productId) ?? null,
    );
  }

  function acceptDraft() {
    for (const line of draftLines ?? []) addItem(line.productId, line.quantity);
    setDraftLines(null);
    setAccepted(true);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {predictions.map((prediction) => {
          const product = productById.get(prediction.productId);
          if (!product) return null;
          const selected = selectedIds.has(product.id);

          return (
            <label
              key={product.id}
              className={`flex cursor-pointer gap-3 rounded-2xl border bg-white p-4 transition-colors ${
                selected ? "border-emerald-300 ring-2 ring-emerald-50" : "border-zinc-100"
              }`}
            >
              <input
                type="checkbox"
                checked={selected}
                onChange={() => toggleSelected(product.id)}
                className="mt-1 h-5 w-5 shrink-0 accent-emerald-600"
              />
              <span
                aria-hidden
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-2xl"
              >
                {product.image}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-zinc-900">{product.name}</span>
                  <Badge tone={CONFIDENCE_TONE[prediction.confidence]}>
                    {prediction.confidence} confidence
                  </Badge>
                </span>
                <span className="mt-1 block text-sm font-medium text-emerald-700">
                  {timingLabel(prediction.daysUntilRestock)}
                </span>
                <span className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-zinc-500">
                  <CalendarClock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {prediction.reason}; next expected {prediction.predictedNextPurchaseAt}.
                </span>
              </span>
            </label>
          );
        })}
      </div>

      <button
        type="button"
        onClick={prepareDraft}
        disabled={selectedIds.size === 0}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-zinc-300 sm:w-auto"
      >
        <ShoppingCart className="h-4 w-4" /> Prepare Restock Cart
      </button>

      {draftLines ? (
        <section className="rounded-2xl border border-emerald-200 bg-white p-4 sm:p-5">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <h2 className="font-semibold text-zinc-900">Review predictive restock cart</h2>
              <p className="mt-1 text-xs text-zinc-500">
                Nothing has been added to your real cart yet. Adjust this proposal, then confirm.
              </p>
            </div>
          </div>

          {draftLines.length > 0 ? (
            <ul className="mt-4 divide-y divide-zinc-100">
              {draftLines.map((line) => {
                const product = productById.get(line.productId);
                if (!product) return null;
                return (
                  <li key={line.productId} className="flex flex-wrap items-center gap-3 py-3">
                    <span aria-hidden className="text-2xl">{product.image}</span>
                    <div className="min-w-[150px] flex-1">
                      <p className="text-sm font-medium text-zinc-900">{product.name}</p>
                      <p className="text-xs text-zinc-500">{product.unit}</p>
                    </div>
                    <div className="ml-auto flex items-center rounded-full bg-zinc-100">
                      <button
                        type="button"
                        onClick={() => changeDraftQuantity(product.id, -1)}
                        aria-label={`Decrease ${product.name}`}
                        className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-zinc-200"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-8 text-center text-sm font-semibold">{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => changeDraftQuantity(product.id, 1)}
                        disabled={line.quantity >= product.stock}
                        aria-label={`Increase ${product.name}`}
                        className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-zinc-200 disabled:opacity-40"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDraftLine(product.id)}
                      aria-label={`Remove ${product.name}`}
                      className="flex h-11 w-11 items-center justify-center rounded-full text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-4 rounded-xl bg-zinc-50 p-4 text-sm text-zinc-500">
              All proposed items were removed. Close the proposal or select recommendations again.
            </p>
          )}

          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setDraftLines(null)}
              className="min-h-11 rounded-full border border-zinc-200 px-5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={acceptDraft}
              disabled={draftLines.length === 0}
              className="min-h-11 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              Accept and add to cart
            </button>
          </div>
        </section>
      ) : null}

      {accepted ? (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="flex-1">The confirmed restock items were added to your cart.</span>
          <Link href="/cart" className="font-semibold underline underline-offset-2">
            Review cart
          </Link>
        </div>
      ) : null}
    </div>
  );
}
