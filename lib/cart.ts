import { products } from "@/data/products";
import { getAntiWasteOfferForProduct } from "@/lib/anti-waste";
import type { CartItem, Product } from "@/types/grocery";

export interface CartLine {
  product: Product;
  quantity: number;
  unitPrice: number;
  unitOriginalPrice: number;
  subtotal: number;
  originalSubtotal: number;
  savings: number;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  originalSubtotal: number;
  savings: number;
}

/** The price the customer actually pays, including an active anti-waste markdown. */
export function getEffectivePrice(product: Product): number {
  return getAntiWasteOfferForProduct(product.id)?.discountedPrice ?? product.price;
}

/** The pre-discount price, falling back to the current price when there is no promotion. */
export function getOriginalPrice(product: Product): number {
  return product.originalPrice ?? product.price;
}

export function getItemSubtotal(product: Product, quantity: number): number {
  return getEffectivePrice(product) * quantity;
}

export function getItemOriginalSubtotal(product: Product, quantity: number): number {
  return getOriginalPrice(product) * quantity;
}

export function getItemSavings(product: Product, quantity: number): number {
  return getItemOriginalSubtotal(product, quantity) - getItemSubtotal(product, quantity);
}

export function getCartLines(items: CartItem[]): CartLine[] {
  return items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      const quantity = Math.min(item.quantity, product.stock);
      return {
        product,
        quantity,
        unitPrice: getEffectivePrice(product),
        unitOriginalPrice: getOriginalPrice(product),
        subtotal: getItemSubtotal(product, quantity),
        originalSubtotal: getItemOriginalSubtotal(product, quantity),
        savings: getItemSavings(product, quantity),
      };
    })
    .filter((line): line is CartLine => line !== null);
}

export function getCartTotals(lines: CartLine[]): CartTotals {
  return lines.reduce(
    (totals, line) => ({
      itemCount: totals.itemCount + line.quantity,
      subtotal: totals.subtotal + line.subtotal,
      originalSubtotal: totals.originalSubtotal + line.originalSubtotal,
      savings: totals.savings + line.savings,
    }),
    { itemCount: 0, subtotal: 0, originalSubtotal: 0, savings: 0 },
  );
}
