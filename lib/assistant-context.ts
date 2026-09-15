import { DEMO_TODAY } from "@/data/demo-date";
import { farms } from "@/data/farms";
import { products } from "@/data/products";
import { storeAisles } from "@/data/store-aisles";
import { currentStore } from "@/data/store";
import { demoCustomer } from "@/data/customer";
import { getAntiWasteOffers } from "@/lib/anti-waste";
import { adjustRestockPredictionsWithPantry } from "@/lib/pantry-restock-core";
import { withCalculatedPantryStatus } from "@/lib/pantry-core";
import { getRestockPredictions } from "@/lib/restock-predictions";
import { buildShoppingRoute } from "@/lib/store-routing-core";
import type {
  AssistantClientState,
  AssistantStructuredContext,
} from "@/types/assistant-context";

export function buildAssistantStructuredContext(
  clientState: AssistantClientState,
): AssistantStructuredContext {
  const productById = new Map(products.map((product) => [product.id, product]));
  const pantryItems = withCalculatedPantryStatus(
    clientState.pantryItems.filter(
      (item) => item.customerId === demoCustomer.id && productById.has(item.productId),
    ),
    DEMO_TODAY,
  );
  const cartItems = clientState.cartItems
    .filter((item) => item.quantity > 0 && productById.has(item.productId))
    .map((item) => ({
      ...item,
      quantity: Math.min(item.quantity, productById.get(item.productId)?.stock ?? 0),
    }))
    .filter((item) => item.quantity > 0);
  const restock = adjustRestockPredictionsWithPantry(
    getRestockPredictions(),
    pantryItems,
  );

  return {
    pantryItems,
    restockRecommendations: restock.recommendations,
    restocksCoveredByPantry: restock.coveredByPantry,
    antiWasteOffers: getAntiWasteOffers(),
    farms,
    shoppingRoute: buildShoppingRoute({
      items: cartItems,
      catalog: products,
      aisles: storeAisles,
      storeId: currentStore.id,
      source: "cart",
    }),
  };
}
