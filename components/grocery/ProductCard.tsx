"use client";

import { Star } from "lucide-react";
import Badge, { type BadgeTone } from "@/components/ui/Badge";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { useCart } from "@/components/cart/CartProvider";
import { promotions } from "@/data/promotions";
import type { Product, PromotionType } from "@/types/grocery";

const TINT_CLASSES: Record<Product["cardTint"], string> = {
  green: "bg-emerald-50",
  purple: "bg-violet-50",
  pink: "bg-rose-50",
};

const PROMOTION_TONE: Record<PromotionType, BadgeTone> = {
  "percentage-discount": "deal",
  "member-deal": "info",
  "sell-by-deal": "deal",
};

function formatTag(tag: string) {
  return tag.replace(/-/g, " ");
}

export default function ProductCard({ product }: { product: Product }) {
  const { getQuantity, addItem, increment, decrement } = useCart();
  const quantity = getQuantity(product.id);
  const outOfStock = product.stock <= 0;

  const discountPercent = product.originalPrice
    ? Math.round(100 - (product.price / product.originalPrice) * 100)
    : null;
  const promotion = product.promotion
    ? promotions.find((p) => p.id === product.promotion)
    : undefined;
  const visibleTags = product.tags.slice(0, 3);
  const hiddenTagCount = product.tags.length - visibleTags.length;

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
        <span aria-hidden>{product.image}</span>
      </div>

      {promotion || product.tags.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {promotion ? (
            <Badge tone={PROMOTION_TONE[promotion.type]}>{promotion.label}</Badge>
          ) : null}
          {visibleTags.map((tag) => (
            <Badge key={tag} tone="neutral">
              {formatTag(tag)}
            </Badge>
          ))}
          {hiddenTagCount > 0 ? (
            <Badge tone="neutral">+{hiddenTagCount}</Badge>
          ) : null}
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
        {product.originalPrice ? (
          <span className="text-sm text-zinc-400 line-through">
            ${product.originalPrice.toFixed(2)}
          </span>
        ) : null}
      </div>

      <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        In stock · {product.stock} on shelf
      </p>

      {quantity > 0 ? (
        <QuantityStepper
          quantity={quantity}
          onIncrement={() => increment(product.id)}
          onDecrement={() => decrement(product.id)}
          incrementDisabled={quantity >= product.stock}
          className="mt-3"
        />
      ) : (
        <button
          type="button"
          onClick={() => addItem(product.id)}
          disabled={outOfStock}
          className="mt-3 w-full rounded-full bg-emerald-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          {outOfStock ? "Out of stock" : "Add to cart"}
        </button>
      )}
    </div>
  );
}
