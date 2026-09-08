import { Star } from "lucide-react";
import Badge, { type BadgeTone } from "@/components/ui/Badge";
import { currentStore } from "@/data/store";
import type { Product, ProductBadge } from "@/types/grocery";

const TINT_CLASSES: Record<Product["cardTint"], string> = {
  green: "bg-emerald-50",
  purple: "bg-violet-50",
  pink: "bg-rose-50",
};

const BADGE_META: Record<ProductBadge, { label: string; tone: BadgeTone }> = {
  "in-stock-local": { label: `In stock at ${currentStore.name.replace("FreshWave ", "")}`, tone: "brand" },
  "member-deal": { label: "Member deal", tone: "info" },
  recommended: { label: "Recommended for your plan", tone: "brand" },
  "bought-before": { label: "Bought before", tone: "neutral" },
  "sell-by-deal": { label: "Sell-by deal", tone: "deal" },
};

export default function ProductCard({ product }: { product: Product }) {
  const discountPercent = product.previousPrice
    ? Math.round(100 - (product.price / product.previousPrice) * 100)
    : null;

  return (
    <div className="flex flex-col rounded-2xl border border-zinc-100 bg-white p-3 shadow-sm">
      <div
        className={`relative flex h-28 items-center justify-center rounded-xl text-5xl ${TINT_CLASSES[product.cardTint]}`}
      >
        {discountPercent ? (
          <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
            −{discountPercent}%
          </span>
        ) : null}
        <span aria-hidden>{product.emoji}</span>
      </div>

      {product.badges && product.badges.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {product.badges.map((badge) => (
            <Badge key={badge} tone={BADGE_META[badge].tone}>
              {BADGE_META[badge].label}
            </Badge>
          ))}
        </div>
      ) : null}

      <h3 className="mt-2 text-sm font-semibold text-zinc-900">
        {product.name}
      </h3>
      <p className="text-xs text-zinc-500">{product.unit}</p>

      <div className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" strokeWidth={0} />
        {product.rating} · {product.reviewCount.toLocaleString()} reviews
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-lg font-semibold text-zinc-900">
          ${product.price.toFixed(2)}
        </span>
        {product.previousPrice ? (
          <span className="text-sm text-zinc-400 line-through">
            ${product.previousPrice.toFixed(2)}
          </span>
        ) : null}
      </div>

      <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        In stock · {product.stock} on shelf
      </p>

      <button
        type="button"
        className="mt-3 w-full rounded-full bg-emerald-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        Add to cart
      </button>
    </div>
  );
}
