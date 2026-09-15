"use client";

import Link from "next/link";
import {
  BadgePercent,
  ChevronRight,
  MapPinned,
  RefreshCcw,
  Sprout,
  Warehouse,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { usePantry } from "@/components/pantry/PantryProvider";
import { DEMO_TODAY } from "@/data/demo-date";
import { products } from "@/data/products";
import { storeAisles } from "@/data/store-aisles";
import { currentStore } from "@/data/store";
import { getAntiWasteOffers } from "@/lib/anti-waste";
import { adjustRestockPredictionsWithPantry } from "@/lib/pantry-restock-core";
import { getPantryDaysRemaining } from "@/lib/pantry-core";
import { getRestockPredictions } from "@/lib/restock-predictions";
import { buildShoppingRoute } from "@/lib/store-routing-core";

export default function IntelligenceOverview() {
  const { items: cartItems } = useCart();
  const { items: pantryItems } = usePantry();
  const restock = adjustRestockPredictionsWithPantry(
    getRestockPredictions(),
    pantryItems,
  );
  const expiringThisWeek = pantryItems.filter((item) => {
    if (!item.expiresAt || item.quantity <= 0) return false;
    const days = getPantryDaysRemaining(item.expiresAt, DEMO_TODAY);
    return days >= 0 && days <= 7;
  });
  const personalizedOffers = getAntiWasteOffers().filter((offer) => offer.personalized);
  const route = buildShoppingRoute({
    items: cartItems,
    catalog: products,
    aisles: storeAisles,
    storeId: currentStore.id,
  });
  const routeSections = route.stops.filter((stop) => stop.productIds.length > 0).length;

  const cards = [
    {
      href: "/my-kitchen/smart-fridge",
      icon: RefreshCcw,
      iconClass: "bg-violet-100 text-violet-700",
      title: `${restock.recommendations.length} items may need restocking soon`,
      detail: restock.coveredByPantry.length > 0
        ? `${restock.coveredByPantry.length} unnecessary restock avoided using pantry data`
        : "Purchase history checked against your pantry",
    },
    {
      href: "/my-kitchen/pantry",
      icon: Warehouse,
      iconClass: "bg-amber-100 text-amber-700",
      title: `${expiringThisWeek.length} pantry items expire this week`,
      detail: "Cook with ingredients that need attention first",
    },
    {
      href: "/deals/anti-waste",
      icon: BadgePercent,
      iconClass: "bg-red-100 text-red-700",
      title: `${personalizedOffers.length} personalized anti-waste deals`,
      detail: "Discounts calculated from structured freshness data",
    },
    {
      href: "/in-store-navigator",
      icon: MapPinned,
      iconClass: "bg-sky-100 text-sky-700",
      title: routeSections > 0 ? `Open your ${routeSections}-section store route` : "Plan an in-store shopping route",
      detail: routeSections > 0 ? "Your cart is organized by aisle" : "Add products, then minimize backtracking",
    },
    {
      href: "/products/honeycrisp-apples",
      icon: Sprout,
      iconClass: "bg-emerald-100 text-emerald-700",
      title: "See where your local produce came from",
      detail: "Explore the fictional Green Valley Orchard demo",
    },
  ];

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">FreshWave at a glance</h2>
        <p className="text-xs text-zinc-500">Connected insights from store, purchase, and pantry data.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-5">
        {cards.map(({ href, icon: Icon, iconClass, title, detail }) => (
          <Link key={href} href={href} className="group flex min-w-0 items-start gap-3 rounded-2xl border border-zinc-100 bg-white p-4 hover:border-emerald-200">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold leading-5 text-zinc-900">{title}</span>
              <span className="mt-1 block text-xs leading-5 text-zinc-500">{detail}</span>
            </span>
            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-zinc-300 group-hover:text-emerald-600" />
          </Link>
        ))}
      </div>
    </section>
  );
}
