"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, CheckCircle2, Circle, MapPinned, Navigation, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import StoreFloorPlan from "@/components/navigator/StoreFloorPlan";
import { buildShoppingRoute } from "@/lib/store-routing-core";
import type { Product, Store } from "@/types/grocery";
import type { StoreAisle } from "@/types/intelligence";

export default function InStoreNavigator({
  catalog,
  aisles,
  store,
}: {
  catalog: Product[];
  aisles: StoreAisle[];
  store: Store;
}) {
  const { items } = useCart();
  const route = useMemo(
    () => buildShoppingRoute({ items, catalog, aisles, storeId: store.id }),
    [items, catalog, aisles, store.id],
  );
  const productById = useMemo(
    () => new Map(catalog.map((product) => [product.id, product])),
    [catalog],
  );
  const aisleById = useMemo(
    () => new Map(aisles.map((aisle) => [aisle.id, aisle])),
    [aisles],
  );
  const [started, setStarted] = useState(false);
  const [collectedProductIds, setCollectedProductIds] = useState<Set<string>>(
    () => new Set(),
  );

  const shoppingStops = route.stops.filter((stop) => stop.productIds.length > 0);
  const routeProductIds = shoppingStops.flatMap((stop) => stop.productIds);
  const collectedCount = routeProductIds.filter((id) => collectedProductIds.has(id)).length;
  const complete = routeProductIds.length > 0 && collectedCount === routeProductIds.length;

  function toggleProduct(productId: string) {
    if (!started) return;
    setCollectedProductIds((current) => {
      const next = new Set(current);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }

  function toggleSection(productIds: string[]) {
    if (!started) return;
    setCollectedProductIds((current) => {
      const next = new Set(current);
      const allCollected = productIds.every((id) => next.has(id));
      for (const id of productIds) {
        if (allCollected) next.delete(id);
        else next.add(id);
      }
      return next;
    });
  }

  if (shoppingStops.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-8 text-center">
        <ShoppingCart className="mx-auto h-8 w-8 text-zinc-400" />
        <h2 className="mt-3 font-semibold text-zinc-900">Your route needs a shopping cart</h2>
        <p className="mt-1 text-sm text-zinc-500">Add products first, then FreshWave will organize them by aisle.</p>
        <Link href="/" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
      <div className="min-w-0 space-y-4">
        <StoreFloorPlan
          aisles={aisles}
          route={route}
          catalog={catalog}
          collectedProductIds={collectedProductIds}
        />
        <div className="rounded-2xl border border-zinc-100 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-zinc-900">Route summary</p>
              <p className="mt-1 text-xs text-zinc-500">
                {shoppingStops.length} sections · {routeProductIds.length} products · Entrance to Checkout
              </p>
            </div>
            {started ? (
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                {collectedCount}/{routeProductIds.length} collected
              </span>
            ) : null}
          </div>
          {!started ? (
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700 sm:w-auto"
            >
              <Navigation className="h-4 w-4" /> Start Shopping
            </button>
          ) : null}
          <p className="mt-3 text-xs leading-5 text-zinc-400">
            Prototype aisle guidance only. FreshWave does not know your exact indoor position.
          </p>
        </div>
      </div>

      <section className="min-w-0 rounded-2xl border border-zinc-100 bg-white p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <MapPinned className="h-5 w-5 text-violet-600" />
          <h2 className="font-semibold text-zinc-900">Recommended route</h2>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-zinc-50 p-3 text-sm font-medium text-zinc-700">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-700 text-xs text-white">0</span>
          Entrance
        </div>

        <ol className="mt-3 space-y-3">
          {shoppingStops.map((stop, index) => {
            const aisle = aisleById.get(stop.aisleId);
            if (!aisle) return null;
            const sectionComplete = stop.productIds.every((id) => collectedProductIds.has(id));
            return (
              <li key={stop.aisleId} className={`rounded-xl border p-3 ${sectionComplete ? "border-emerald-200 bg-emerald-50" : "border-zinc-100"}`}>
                <div className="flex items-center gap-2">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${sectionComplete ? "bg-emerald-600" : "bg-violet-600"}`}>
                    {sectionComplete ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-zinc-900">{aisle.name}</p>
                    <p className="text-xs text-zinc-500">Zone {aisle.code}</p>
                  </div>
                  {started ? (
                    <button
                      type="button"
                      onClick={() => toggleSection(stop.productIds)}
                      className="min-h-11 rounded-full px-3 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                    >
                      {sectionComplete ? "Undo section" : "Collect section"}
                    </button>
                  ) : null}
                </div>
                <ul className="mt-2 space-y-1">
                  {stop.productIds.map((productId) => {
                    const product = productById.get(productId);
                    if (!product) return null;
                    const collected = collectedProductIds.has(productId);
                    return (
                      <li key={productId}>
                        <button
                          type="button"
                          disabled={!started}
                          onClick={() => toggleProduct(productId)}
                          className="flex min-h-11 w-full items-center gap-2 rounded-lg px-2 text-left text-sm hover:bg-white disabled:cursor-default"
                        >
                          {collected ? (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                          ) : (
                            <Circle className="h-5 w-5 shrink-0 text-zinc-300" />
                          )}
                          <span aria-hidden>{product.image}</span>
                          <span className={collected ? "text-zinc-400 line-through" : "text-zinc-700"}>
                            {product.name}
                          </span>
                          <span className="ml-auto shrink-0 text-xs text-zinc-400">{product.storeLocation.shelfZone}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
          <li className={`flex items-center gap-3 rounded-xl p-3 text-sm font-semibold ${complete ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-700"}`}>
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${complete ? "bg-white/20" : "bg-zinc-700 text-white"}`}>
              {shoppingStops.length + 1}
            </span>
            Checkout
          </li>
        </ol>
      </section>
    </div>
  );
}
