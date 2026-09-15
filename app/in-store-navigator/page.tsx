import { MapPinned, Route, ShieldCheck } from "lucide-react";
import InStoreNavigator from "@/components/navigator/InStoreNavigator";
import { products } from "@/data/products";
import { storeAisles } from "@/data/store-aisles";
import { currentStore } from "@/data/store";

export default function InStoreNavigatorPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-sky-700 to-emerald-600 p-5 text-white sm:p-8">
        <div className="flex items-center gap-2 text-sky-50">
          <MapPinned className="h-5 w-5" />
          <span className="text-sm font-semibold">FreshWave Riverside</span>
        </div>
        <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">In-Store Navigator</h1>
        <p className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base">
          Turn your cart into a clear aisle sequence that minimizes backtracking through the store.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-100 bg-white p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
            <Route className="h-4 w-4 text-sky-600" /> Deterministic store order
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            Products are grouped by aisle and sequenced clockwise from Entrance to Checkout.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-100 bg-white p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> No location tracking
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            This prototype provides aisle guidance; it does not use GPS hardware or detect shoppers.
          </p>
        </div>
      </section>

      <InStoreNavigator catalog={products} aisles={storeAisles} store={currentStore} />
    </div>
  );
}
