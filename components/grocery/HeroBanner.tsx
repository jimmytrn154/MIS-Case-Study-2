import Link from "next/link";
import { Sparkles, MapPin, Tag, Store } from "lucide-react";

const FEATURES = [
  { label: "AI personalization", icon: Sparkles },
  { label: "Live local inventory", icon: MapPin },
  { label: "Promotions applied", icon: Tag },
  { label: "Store pickup", icon: Store },
];

export default function HeroBanner() {
  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-600 to-emerald-500 px-6 py-8 text-white sm:px-10 sm:py-10">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
        <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
        FreshWave Assistant
      </span>
      <h1 className="mt-4 max-w-xl text-2xl font-semibold leading-tight sm:text-3xl">
        A meal plan built from what&apos;s actually on your shelf
      </h1>
      <p className="mt-3 max-w-xl text-sm text-emerald-50 sm:text-base">
        Tell the Assistant your household size, budget, and dietary needs.
        It plans meals from Riverside&apos;s in-stock products, applies
        current promotions, and gets your cart ready for pickup.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/assistant"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
        >
          Start a meal plan
        </Link>
      </div>
      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {FEATURES.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium sm:text-sm"
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            {label}
          </div>
        ))}
      </dl>
    </section>
  );
}
