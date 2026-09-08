import { Award } from "lucide-react";
import { demoCustomer } from "@/data/customer";

export default function RewardsSummary() {
  const { name, memberSince, dietaryRestrictions, loyalty } = demoCustomer;

  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
      <div className="flex items-center gap-2 text-emerald-800">
        <Award className="h-4 w-4" strokeWidth={1.75} />
        <span className="text-sm font-semibold">{name}&apos;s Rewards</span>
      </div>
      <p className="mt-1 text-xs text-emerald-700">
        {loyalty.points.toLocaleString()} pts · Member since {memberSince}
      </p>
      <p className="text-xs text-emerald-700">
        ${loyalty.monthlySavings.toFixed(2)} saved this month
      </p>
      {dietaryRestrictions.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {dietaryRestrictions.map((restriction) => (
            <span
              key={restriction}
              className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-800"
            >
              {restriction}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
