import { BrainCircuit, CalendarClock, ShieldCheck } from "lucide-react";
import SmartFridgeDashboard from "@/components/kitchen/SmartFridgeDashboard";
import { DEMO_TODAY } from "@/data/demo-date";
import { products } from "@/data/products";
import { getRestockPredictions, isLikelyRunningLow } from "@/lib/restock-predictions";

export default function SmartFridgePage() {
  const allPredictions = getRestockPredictions();
  const likelyRunningLow = allPredictions.filter(isLikelyRunningLow);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-violet-700 to-emerald-600 p-6 text-white sm:p-8">
        <div className="flex items-center gap-2 text-violet-50">
          <BrainCircuit className="h-5 w-5" />
          <span className="text-sm font-semibold">My Kitchen · Smart Fridge</span>
        </div>
        <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">Likely running low</h1>
        <p className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base">
          Predictive suggestions based on Sarah&apos;s past buying rhythm—not automatic
          purchasing and not a trained machine-learning model.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-full bg-white/15 px-3 py-1.5">
            {likelyRunningLow.length} products approaching restock
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1.5">
            Demo forecast · {DEMO_TODAY}
          </span>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-100 bg-white p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
            <CalendarClock className="h-4 w-4 text-violet-600" /> Explainable forecast
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            Next purchase date = last purchase date + average interval between purchases.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-100 bg-white p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Customer controlled
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            Review, remove, or change quantities before anything enters the real cart.
          </p>
        </div>
      </section>

      <SmartFridgeDashboard predictions={likelyRunningLow} catalog={products} />
    </div>
  );
}
