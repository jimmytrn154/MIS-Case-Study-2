import { PackageCheck, ShieldCheck, Warehouse } from "lucide-react";
import KitchenTabs from "@/components/kitchen/KitchenTabs";
import VirtualPantryDashboard from "@/components/pantry/VirtualPantryDashboard";
import { DEMO_TODAY } from "@/data/demo-date";
import { products } from "@/data/products";

export default function VirtualPantryPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <KitchenTabs />
      <section className="rounded-3xl bg-gradient-to-br from-amber-600 to-emerald-600 p-5 text-white sm:p-8">
        <div className="flex items-center gap-2 text-amber-50">
          <Warehouse className="h-5 w-5" />
          <span className="text-sm font-semibold">My Kitchen · Virtual Pantry</span>
        </div>
        <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">What Sarah has at home</h1>
        <p className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base">
          Track demo purchases, use food before it expires, cook from current quantities, and confirm restocks.
        </p>
        <span className="mt-5 inline-flex rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">Demo pantry · {DEMO_TODAY}</span>
      </section>
      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-100 bg-white p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-zinc-900"><PackageCheck className="h-4 w-4 text-amber-600" /> Explicit home inventory</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">Unlike Smart Fridge predictions, pantry quantities represent groceries Sarah currently owns.</p>
        </div>
        <div className="rounded-2xl border border-zinc-100 bg-white p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-zinc-900"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Deterministic quantities</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">Dates, quantities, deductions, and restocks stay in application code—not the language model.</p>
        </div>
      </section>
      <VirtualPantryDashboard catalog={products} />
    </div>
  );
}
