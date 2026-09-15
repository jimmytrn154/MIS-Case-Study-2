import { CalendarDays, Leaf, MapPin, Route, Tractor } from "lucide-react";
import TraceabilityMap from "@/components/traceability/TraceabilityMap";
import Badge from "@/components/ui/Badge";
import type { Product, Store } from "@/types/grocery";
import type { Farm, TraceabilityRecord } from "@/types/intelligence";

function formattedDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function ProductTraceability({
  product,
  farm,
  store,
  record,
}: {
  product: Product;
  farm: Farm;
  store: Store;
  record: TraceabilityRecord;
}) {
  return (
    <section className="space-y-4 rounded-3xl border border-emerald-100 bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Badge tone="brand"><Leaf className="h-3 w-3" /> Traceable origin</Badge>
          <h2 className="mt-2 text-xl font-semibold text-zinc-900">Where this came from</h2>
          <p className="mt-1 text-sm text-zinc-500">Shared FreshWave provenance data for {product.name}.</p>
        </div>
        <span className="max-w-full rounded-full bg-amber-50 px-3 py-1 text-center text-xs font-semibold text-amber-700">
          Fictional demo producer
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="space-y-3 rounded-2xl bg-zinc-50 p-4">
          <div className="flex items-start gap-3">
            <Tractor className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <p className="font-semibold text-zinc-900">{farm.name}</p>
              <p className="text-sm text-zinc-500">{farm.region}</p>
            </div>
          </div>
          <p className="text-sm leading-6 text-zinc-600">{farm.description}</p>
          <dl className="space-y-2 border-t border-zinc-200 pt-3 text-sm">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <CalendarDays className="h-4 w-4 shrink-0 text-zinc-500" />
              <dt className="capitalize text-zinc-500">{record.originDateType}:</dt>
              <dd className="font-medium text-zinc-900">{formattedDate(record.originDate)}</dd>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <Route className="h-4 w-4 shrink-0 text-zinc-500" />
              <dt className="text-zinc-500">Approximate distance:</dt>
              <dd className="font-medium text-zinc-900">{farm.distanceFromStoreKm} km</dd>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
              <dt className="text-zinc-500">Destination:</dt>
              <dd className="font-medium text-zinc-900">{store.name}</dd>
            </div>
          </dl>
        </div>
        <TraceabilityMap farm={farm} store={store} />
      </div>

      <p className="text-xs leading-5 text-zinc-400">
        Prototype visualization only. Producer profiles, coordinates, dates, and distances are structured fictional data—not live supplier tracking.
      </p>
    </section>
  );
}
