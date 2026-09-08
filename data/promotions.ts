import type { Promotion } from "@/types/grocery";

export const promotions: Promotion[] = [
  { id: "percent-off", type: "percentage-discount", label: "Limited-time discount" },
  { id: "member-deal", type: "member-deal", label: "Member deal" },
  { id: "bundle-save", type: "member-deal", label: "Member bundle savings" },
  { id: "sell-by-deal", type: "sell-by-deal", label: "Sell-by deal" },
  { id: "clearance", type: "sell-by-deal", label: "Clearance today" },
];
