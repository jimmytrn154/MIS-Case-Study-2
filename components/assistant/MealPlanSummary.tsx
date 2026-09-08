import { Wallet, PiggyBank } from "lucide-react";

export default function MealPlanSummary({
  estimatedTotal,
  estimatedSavings,
  budget,
}: {
  estimatedTotal: number;
  estimatedSavings: number;
  budget?: number;
}) {
  const remaining = budget !== undefined ? budget - estimatedTotal : null;

  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="flex items-center gap-1.5 text-xs text-emerald-700">
            <Wallet className="h-3.5 w-3.5" strokeWidth={1.75} />
            Estimated total
          </p>
          <p className="text-lg font-semibold text-zinc-900">
            ${estimatedTotal.toFixed(2)}
          </p>
        </div>
        {estimatedSavings > 0 ? (
          <div>
            <p className="flex items-center gap-1.5 text-xs text-emerald-700">
              <PiggyBank className="h-3.5 w-3.5" strokeWidth={1.75} />
              Estimated savings
            </p>
            <p className="text-lg font-semibold text-emerald-700">
              ${estimatedSavings.toFixed(2)}
            </p>
          </div>
        ) : null}
      </div>

      {remaining !== null ? (
        <p
          className={`mt-3 text-sm font-medium ${
            remaining >= 0 ? "text-emerald-700" : "text-red-600"
          }`}
        >
          {remaining >= 0
            ? `$${remaining.toFixed(2)} under budget`
            : `$${Math.abs(remaining).toFixed(2)} over budget`}
        </p>
      ) : null}
    </div>
  );
}
