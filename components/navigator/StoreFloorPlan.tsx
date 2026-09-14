import type { Product } from "@/types/grocery";
import type { ShoppingRoute, StoreAisle } from "@/types/intelligence";

export default function StoreFloorPlan({
  aisles,
  route,
  catalog,
  collectedProductIds,
}: {
  aisles: StoreAisle[];
  route: ShoppingRoute;
  catalog: Product[];
  collectedProductIds: Set<string>;
}) {
  const aisleById = new Map(aisles.map((aisle) => [aisle.id, aisle]));
  const routeAisleIds = new Set(route.stops.map((stop) => stop.aisleId));
  const routePoints = route.stops
    .map((stop) => aisleById.get(stop.aisleId))
    .filter((aisle): aisle is StoreAisle => Boolean(aisle))
    .map(
      (aisle) =>
        `${aisle.floorPlan.x + aisle.floorPlan.width / 2},${
          aisle.floorPlan.y + aisle.floorPlan.height / 2
        }`,
    )
    .join(" ");
  const itemStops = route.stops.filter((stop) => stop.productIds.length > 0);
  const stopNumberByAisle = new Map(
    itemStops.map((stop, index) => [stop.aisleId, index + 1]),
  );
  const productById = new Map(catalog.map((product) => [product.id, product]));

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label="Simplified FreshWave Riverside floor plan with highlighted shopping route"
        className="block h-auto w-full"
      >
        <rect width="100" height="100" fill="#fafafa" />
        {routePoints ? (
          <polyline
            points={routePoints}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.25"
            strokeDasharray="3 2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
        {aisles.map((aisle) => {
          const stop = route.stops.find((candidate) => candidate.aisleId === aisle.id);
          const completed =
            Boolean(stop?.productIds.length) &&
            stop!.productIds.every((productId) => collectedProductIds.has(productId));
          const active = routeAisleIds.has(aisle.id);
          const number = stopNumberByAisle.get(aisle.id);
          const itemCount = stop?.productIds.filter((id) => productById.has(id)).length ?? 0;

          return (
            <g key={aisle.id}>
              <rect
                x={aisle.floorPlan.x}
                y={aisle.floorPlan.y}
                width={aisle.floorPlan.width}
                height={aisle.floorPlan.height}
                rx="2"
                fill={completed ? "#d1fae5" : active ? "#ecfdf5" : "#f4f4f5"}
                stroke={completed ? "#059669" : active ? "#10b981" : "#d4d4d8"}
                strokeWidth={active ? "1" : "0.5"}
              />
              <text
                x={aisle.floorPlan.x + aisle.floorPlan.width / 2}
                y={aisle.floorPlan.y + aisle.floorPlan.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="3"
                fontWeight={active ? "700" : "500"}
                fill={active ? "#065f46" : "#71717a"}
              >
                {aisle.name.length > 16 ? aisle.code : aisle.name}
              </text>
              {number ? (
                <g transform={`translate(${aisle.floorPlan.x + 3.5} ${aisle.floorPlan.y + 3.5})`}>
                  <circle r="3" fill={completed ? "#059669" : "#7c3aed"} />
                  <text textAnchor="middle" dominantBaseline="middle" fontSize="3" fontWeight="700" fill="white">
                    {number}
                  </text>
                </g>
              ) : null}
              {itemCount > 0 ? (
                <text
                  x={aisle.floorPlan.x + aisle.floorPlan.width / 2}
                  y={aisle.floorPlan.y + aisle.floorPlan.height / 2 + 5}
                  textAnchor="middle"
                  fontSize="2.6"
                  fill="#047857"
                >
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-zinc-100 px-4 py-3 text-xs text-zinc-500">
        <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-emerald-500 bg-emerald-50" /> Route stop</span>
        <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-emerald-600 bg-emerald-100" /> Collected</span>
        <span><span className="mr-1 inline-block h-0.5 w-4 align-middle bg-emerald-500" /> Recommended path</span>
      </div>
    </div>
  );
}
