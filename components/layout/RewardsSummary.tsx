import { Award } from "lucide-react";
import { loyaltySummary } from "@/data/loyalty";

export default function RewardsSummary() {
  const { tier, points, pointsToNextTier, nextTier } = loyaltySummary;
  const progress = Math.min(
    100,
    Math.round((points / (points + pointsToNextTier)) * 100),
  );

  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
      <div className="flex items-center gap-2 text-emerald-800">
        <Award className="h-4 w-4" strokeWidth={1.75} />
        <span className="text-sm font-semibold">{tier}</span>
      </div>
      <p className="mt-1 text-xs text-emerald-700">
        {points.toLocaleString()} pts · {pointsToNextTier} to {nextTier}
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-emerald-100">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
