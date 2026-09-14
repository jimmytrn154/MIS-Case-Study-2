"use client";

import { useCart } from "@/components/cart/CartProvider";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { getAntiWasteOfferForProduct } from "@/lib/anti-waste";
import { getEffectivePrice } from "@/lib/cart";
import type { Product } from "@/types/grocery";

export default function ProductDetailActions({ product }: { product: Product }) {
  const { getQuantity, addItem, increment, decrement } = useCart();
  const quantity = getQuantity(product.id);
  const price = getEffectivePrice(product);
  const antiWasteOffer = getAntiWasteOfferForProduct(product.id);

  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-zinc-900">${price.toFixed(2)}</span>
        <span className="text-sm text-zinc-500">{product.unit}</span>
        {antiWasteOffer ? (
          <span className="text-sm text-zinc-400 line-through">${product.price.toFixed(2)}</span>
        ) : product.originalPrice ? (
          <span className="text-sm text-zinc-400 line-through">${product.originalPrice.toFixed(2)}</span>
        ) : null}
      </div>
      {antiWasteOffer ? (
        <p className="text-sm font-medium text-red-600">
          Smart anti-waste price · {antiWasteOffer.discountPercent}% off
        </p>
      ) : null}
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
          disabled={product.stock <= 0}
          className="flex min-h-11 w-full items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-zinc-300 sm:w-auto"
        >
          {product.stock > 0 ? "Add to cart" : "Out of stock"}
        </button>
      )}
    </div>
  );
}
