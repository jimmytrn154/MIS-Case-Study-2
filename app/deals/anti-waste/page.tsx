import { Leaf, ShieldCheck, Sparkles } from "lucide-react";
import AntiWasteDeals from "@/components/deals/AntiWasteDeals";
import { DEMO_TODAY } from "@/data/demo-date";
import { products } from "@/data/products";
import { getAntiWasteOffers } from "@/lib/anti-waste";

export default function AntiWasteDealsPage() {
  const offers = getAntiWasteOffers();
  const personalizedCount = offers.filter((offer) => offer.personalized).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-500 p-6 text-white sm:p-8">
        <div className="flex items-center gap-2 text-emerald-50">
          <Leaf className="h-5 w-5" />
          <span className="text-sm font-semibold">Smart Anti-Waste Deals</span>
        </div>
        <h1 className="mt-3 max-w-2xl text-2xl font-semibold sm:text-3xl">
          Save on fresh food that deserves to be enjoyed
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-emerald-50 sm:text-base">
          FreshWave applies an explainable markdown as eligible food approaches its
          sell-by or expiration date, then brings Sarah&apos;s regular purchases to the top.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-full bg-white/15 px-3 py-1.5">
            {offers.length} active offers
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1.5">
            {personalizedCount} based on your purchases
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1.5">
            Demo inventory · {DEMO_TODAY}
          </span>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-100 bg-white p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Deterministic pricing
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            3 days: 15% · 2 days: 25% · 1 day: 35% · same day: 40%.
            Expired items and products outside the three-day window are excluded.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-100 bg-white p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
            <Sparkles className="h-4 w-4 text-violet-600" /> Personalized ordering
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            Products Sarah has purchased at least three times are ranked first. Gemini
            does not calculate prices, eligibility, or ranking.
          </p>
        </div>
      </section>

      <AntiWasteDeals offers={offers} catalog={products} />
    </div>
  );
}
