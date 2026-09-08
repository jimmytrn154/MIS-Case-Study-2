import type { CustomerProfile } from "@/types/grocery";

export const demoCustomer: CustomerProfile = {
  id: "sarah",
  name: "Sarah",
  householdSize: 2,
  memberSince: 2024,
  preferences: ["healthy meals", "high protein", "budget conscious"],
  dietaryRestrictions: ["no pork"],
  loyalty: {
    points: 1250,
    monthlySavings: 38.5,
  },
};
