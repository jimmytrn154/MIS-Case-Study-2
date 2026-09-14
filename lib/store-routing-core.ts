import type { CartItem, Product } from "../types/grocery.ts";
import type { ShoppingRoute, ShoppingRouteStop, StoreAisle } from "../types/intelligence.ts";

/**
 * Groups requested products by store zone and follows Riverside's fixed
 * clockwise traversal order. This avoids backtracking without pretending to
 * provide live indoor positioning or a full GIS shortest-path system.
 */
export function buildShoppingRoute({
  items,
  catalog,
  aisles,
  storeId,
  source = "cart",
}: {
  items: CartItem[];
  catalog: Product[];
  aisles: StoreAisle[];
  storeId: string;
  source?: ShoppingRoute["source"];
}): ShoppingRoute {
  const productById = new Map(catalog.map((product) => [product.id, product]));
  const productsByAisle = new Map<string, Product[]>();

  for (const item of items) {
    if (item.quantity <= 0) continue;
    const product = productById.get(item.productId);
    if (!product) continue;
    const aisleProducts = productsByAisle.get(product.storeLocation.aisleId) ?? [];
    if (!aisleProducts.some((candidate) => candidate.id === product.id)) {
      aisleProducts.push(product);
      productsByAisle.set(product.storeLocation.aisleId, aisleProducts);
    }
  }

  const orderedAisles = [...aisles].sort(
    (a, b) => a.traversalOrder - b.traversalOrder,
  );
  const entrance = orderedAisles.find((aisle) => aisle.id === "entrance");
  const checkout = orderedAisles.find((aisle) => aisle.id === "checkout");
  const stops: ShoppingRouteStop[] = [];

  if (entrance) {
    stops.push({
      aisleId: entrance.id,
      productIds: [],
      sequence: stops.length,
      collectedProductIds: [],
    });
  }

  for (const aisle of orderedAisles) {
    if (aisle.id === "entrance" || aisle.id === "checkout") continue;
    const aisleProducts = productsByAisle.get(aisle.id);
    if (!aisleProducts?.length) continue;
    aisleProducts.sort(
      (a, b) =>
        a.storeLocation.shelfZone.localeCompare(b.storeLocation.shelfZone) ||
        a.name.localeCompare(b.name),
    );
    stops.push({
      aisleId: aisle.id,
      productIds: aisleProducts.map((product) => product.id),
      sequence: stops.length,
      collectedProductIds: [],
    });
  }

  if (checkout && stops.length > 1) {
    stops.push({
      aisleId: checkout.id,
      productIds: [],
      sequence: stops.length,
      collectedProductIds: [],
    });
  }

  return { storeId, source, stops };
}
