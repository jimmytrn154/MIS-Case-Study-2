import { products } from "@/data/products";
import { storeAisles } from "@/data/store-aisles";
import { currentStore } from "@/data/store";
import { buildShoppingRoute } from "@/lib/store-routing-core";
import type { CartItem } from "@/types/grocery";

export { buildShoppingRoute } from "@/lib/store-routing-core";

export function getCartShoppingRoute(items: CartItem[]) {
  return buildShoppingRoute({
    items,
    catalog: products,
    aisles: storeAisles,
    storeId: currentStore.id,
    source: "cart",
  });
}
