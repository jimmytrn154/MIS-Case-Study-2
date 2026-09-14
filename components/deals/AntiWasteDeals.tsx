"use client";

import { BadgePercent, Check, Clock3, Leaf, PackageCheck, Sparkles } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import Badge from "@/components/ui/Badge";
import QuantityStepper from "@/components/ui/QuantityStepper";
import type { Product } from "@/types/grocery";
import type { AntiWasteOffer } from "@/types/intelligence";

function freshnessLabel(offer: AntiWasteOffer): string {
  const label = offer.freshnessDateType === "sell-by" ? "sell-by" : "expiration";
  if (offer.daysRemaining === 0) return `${label} date is today`;
  if (offer.daysRemaining === 1) return `1 day until ${label}`;
  return `${offer.daysRemaining} days until ${label}`;
}

function formattedDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

export default function AntiWasteDeals({
  offers,
  catalog,
}: {
  offers: AntiWasteOffer[];
  catalog: Product[];
}) {
  const { getQuantity, addItem, increment, decrement } = useCart();
  const productById = new Map(catalog.map((product) => [product.id, product]));

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {offers.map((offer) => {
        const product = productById.get(offer.productId);
        if (!product) return null;
        const quantity = getQuantity(product.id);

        return (
          <article
            key={offer.id}
            className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm"
          >
            <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-emerald-50 to-lime-50 text-6xl">
              <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
                {offer.discountPercent}% off
              </span>
              {offer.personalized ? (
                <Badge tone="brand" className="absolute right-3 top-3 bg-white shadow-sm">
                  <Sparkles className="h-3 w-3" /> Based on your purchases
                </Badge>
              ) : null}
              <span aria-hidden>{product.image}</span>
            </div>

            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-semibold text-zinc-900">{product.name}</h2>
                  <p className="text-xs text-zinc-500">{product.unit}</p>
                </div>
                <Badge tone="deal" className="shrink-0">
                  <BadgePercent className="h-3 w-3" /> Buy soon
                </Badge>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-700">
                  ${offer.discountedPrice.toFixed(2)}
                </span>
                <span className="text-sm text-zinc-400 line-through">
                  ${offer.normalPrice.toFixed(2)}
                </span>
              </div>

              <div className="mt-3 space-y-2 rounded-xl bg-zinc-50 p-3 text-xs text-zinc-600">
                <p className="flex items-center gap-2 font-medium text-amber-700">
                  <Clock3 className="h-4 w-4 shrink-0" />
                  {freshnessLabel(offer)} · {formattedDate(offer.freshnessDate)}
                </p>
                <p className="flex items-center gap-2">
                  <PackageCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                  {product.stock} currently in stock
                </p>
                <p className="flex items-center gap-2">
                  {offer.personalized ? (
                    <Sparkles className="h-4 w-4 shrink-0 text-violet-600" />
                  ) : (
                    <Check className="h-4 w-4 shrink-0 text-zinc-500" />
                  )}
                  {offer.recommendationReason}
                </p>
              </div>

              <p className="mt-3 flex items-start gap-2 text-xs text-emerald-700">
                <Leaf className="mt-0.5 h-4 w-4 shrink-0" />
                Buying this item helps prevent potential food waste.
              </p>

              <div className="mt-auto pt-4">
                {quantity > 0 ? (
                  <QuantityStepper
                    quantity={quantity}
                    onIncrement={() => increment(product.id)}
                    onDecrement={() => decrement(product.id)}
                    incrementDisabled={quantity >= product.stock}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => addItem(product.id)}
                    className="flex h-11 w-full items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Add to cart · ${offer.discountedPrice.toFixed(2)}
                  </button>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
