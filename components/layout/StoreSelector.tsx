import { MapPin, ChevronDown } from "lucide-react";
import { currentStore } from "@/data/store";

export default function StoreSelector() {
  return (
    <button
      type="button"
      className="flex shrink-0 items-center gap-2 rounded-xl px-2 py-1.5 text-left hover:bg-zinc-50"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
        <MapPin className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <span className="hidden sm:block">
        <span className="flex items-center gap-1 text-sm font-semibold text-zinc-900">
          {currentStore.name}
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400" strokeWidth={2} />
        </span>
        <span className="hidden text-xs text-zinc-500 md:block">
          {currentStore.address} · {currentStore.hoursLabel}
        </span>
      </span>
    </button>
  );
}
