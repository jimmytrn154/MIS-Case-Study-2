import type { Farm } from "@/types/intelligence";

/** All producers in this prototype are fictional demonstration data. */
export const farms: Farm[] = [
  {
    id: "green-valley-orchard",
    name: "Green Valley Orchard",
    region: "North Riverside Hills",
    coordinates: { latitude: 34.094, longitude: -117.477 },
    description: "A fictional family-run orchard used for the FreshWave traceability demo.",
    productTypes: ["apples"],
    distanceFromStoreKm: 18,
    isDemo: true,
  },
  {
    id: "sunrise-fields",
    name: "Sunrise Fields Cooperative",
    region: "East Riverside Plain",
    coordinates: { latitude: 33.981, longitude: -117.218 },
    description: "A fictional vegetable cooperative supplying seasonal greens and brassicas.",
    productTypes: ["broccoli", "spinach", "peppers"],
    distanceFromStoreKm: 24,
    isDemo: true,
  },
  {
    id: "meadowbrook-farm",
    name: "Meadowbrook Family Farm",
    region: "West Riverside Valley",
    coordinates: { latitude: 33.944, longitude: -117.532 },
    description: "A fictional mixed farm supplying eggs and selected poultry for this prototype.",
    productTypes: ["eggs", "chicken"],
    distanceFromStoreKm: 31,
    isDemo: true,
  },
  {
    id: "riverbend-berry-farm",
    name: "Riverbend Berry Farm",
    region: "South Riverside Terrace",
    coordinates: { latitude: 33.842, longitude: -117.392 },
    description: "A fictional small berry grower represented in the FreshWave demo catalog.",
    productTypes: ["strawberries"],
    distanceFromStoreKm: 15,
    isDemo: true,
  },
];
