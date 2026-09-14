import type { Farm } from "@/types/intelligence";
import type { Store } from "@/types/grocery";

function projectedPoints(farm: Farm, store: Store) {
  const longitudeSpan = Math.max(
    Math.abs(farm.coordinates.longitude - store.coordinates.longitude),
    0.01,
  );
  const latitudeSpan = Math.max(
    Math.abs(farm.coordinates.latitude - store.coordinates.latitude),
    0.01,
  );
  const west = Math.min(farm.coordinates.longitude, store.coordinates.longitude) - longitudeSpan * 0.3;
  const east = Math.max(farm.coordinates.longitude, store.coordinates.longitude) + longitudeSpan * 0.3;
  const south = Math.min(farm.coordinates.latitude, store.coordinates.latitude) - latitudeSpan * 0.3;
  const north = Math.max(farm.coordinates.latitude, store.coordinates.latitude) + latitudeSpan * 0.3;

  function project(latitude: number, longitude: number) {
    return {
      x: 36 + ((longitude - west) / (east - west)) * 328,
      y: 34 + ((north - latitude) / (north - south)) * 172,
    };
  }

  return {
    farm: project(farm.coordinates.latitude, farm.coordinates.longitude),
    store: project(store.coordinates.latitude, store.coordinates.longitude),
  };
}

export default function TraceabilityMap({ farm, store }: { farm: Farm; store: Store }) {
  const points = projectedPoints(farm, store);
  const centerX = (points.farm.x + points.store.x) / 2;
  const controlY = Math.min(points.farm.y, points.store.y) - 25;

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50">
      <svg
        viewBox="0 0 400 240"
        role="img"
        aria-label={`Schematic route from ${farm.name} to ${store.name}`}
        className="block h-auto w-full"
      >
        <defs>
          <pattern id={`grid-${farm.id}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#bbf7d0" strokeWidth="1" />
          </pattern>
          <filter id={`shadow-${farm.id}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.18" />
          </filter>
        </defs>
        <rect width="400" height="240" fill="#ecfdf5" />
        <rect width="400" height="240" fill={`url(#grid-${farm.id})`} />
        <path
          d={`M ${points.farm.x} ${points.farm.y} Q ${centerX} ${controlY} ${points.store.x} ${points.store.y}`}
          fill="none"
          stroke="#059669"
          strokeWidth="4"
          strokeDasharray="9 7"
          strokeLinecap="round"
        />
        <g transform={`translate(${points.farm.x} ${points.farm.y})`} filter={`url(#shadow-${farm.id})`}>
          <circle r="15" fill="#16a34a" />
          <path d="M -7 5 V -3 L 0 -9 L 7 -3 V 5 Z" fill="white" />
        </g>
        <g transform={`translate(${points.store.x} ${points.store.y})`} filter={`url(#shadow-${farm.id})`}>
          <circle r="15" fill="#7c3aed" />
          <path d="M -8 -5 H 8 L 6 0 H -6 Z M -6 1 H 6 V 8 H -6 Z" fill="white" />
        </g>
        <g transform={`translate(${Math.max(8, Math.min(points.farm.x - 70, 252))} ${Math.max(18, points.farm.y - 26)})`}>
          <rect width="140" height="20" rx="10" fill="white" fillOpacity="0.92" />
          <text x="70" y="14" textAnchor="middle" fontSize="10" fontWeight="600" fill="#166534">
            Fictional local farm
          </text>
        </g>
        <g transform={`translate(${Math.max(8, Math.min(points.store.x - 70, 252))} ${Math.min(214, points.store.y + 21)})`}>
          <rect width="140" height="20" rx="10" fill="white" fillOpacity="0.92" />
          <text x="70" y="14" textAnchor="middle" fontSize="10" fontWeight="600" fill="#5b21b6">
            FreshWave Riverside
          </text>
        </g>
      </svg>
      <div className="flex flex-col gap-1 border-t border-emerald-100 bg-white/80 px-4 py-3 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
        <span>{farm.name}</span>
        <span aria-hidden className="hidden text-emerald-600 sm:inline">→</span>
        <span>{store.name}</span>
      </div>
    </div>
  );
}
