import type { PromoBanner } from "@/types/grocery";

export const promoBanners: PromoBanner[] = [
  {
    id: "shelf-online",
    title: "Everything on the shelf is now online",
    description:
      "The catalog is built from live inventory at your FreshWave store. If you can see it here, it's on the shelf right now.",
    ctaLabel: "Stock refreshes every 15 minutes",
    tone: "brand",
  },
  {
    id: "sell-by-deals",
    title: "Sell-by deals",
    description: "Items close to their sell-by date, up to 40% off.",
    ctaLabel: "Browse deals",
    tone: "deal",
    href: "/deals/anti-waste",
  },
  {
    id: "pickup-30",
    title: "Pickup in 30 minutes",
    description: "We pick your order and hand it over at the counter.",
    ctaLabel: "Always free",
    tone: "pickup",
  },
];
