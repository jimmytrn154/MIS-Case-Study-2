import { products } from "@/data/products";
import type { CartItem, Product } from "@/types/grocery";

export interface CartLine {
  product: Product;
  quantity: number;
  lineTotal: number;
}

export function getCartLines(items: CartItem[]): CartLine[] {
  return items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return {
        product,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity,
      };
    })
    .filter((line): line is CartLine => line !== null);
}

export function getCartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.lineTotal, 0);
}
