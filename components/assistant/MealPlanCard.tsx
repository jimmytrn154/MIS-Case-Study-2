import { CalendarDays } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { getPromotionBadge } from "@/lib/promotions";
import { formatQuantity } from "@/lib/format";
import type { Meal } from "@/types/meal-plan";

export default function MealPlanCard({ meal }: { meal: Meal }) {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.75} />
          {meal.day}
        </span>
        <span className="text-sm font-semibold text-zinc-900">
          ${meal.estimatedCost.toFixed(2)}
        </span>
      </div>

      <h3 className="mt-2 text-sm font-semibold text-zinc-900">{meal.name}</h3>
      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        All ingredients in stock at Riverside
      </p>

      <ul className="mt-3 space-y-2">
        {meal.ingredients.map((ingredient) => {
          const promotion = getPromotionBadge(ingredient.promotion);
          return (
            <li
              key={ingredient.productId}
              className="flex items-center justify-between gap-2 text-xs text-zinc-600"
            >
              <span className="flex min-w-0 flex-wrap items-center gap-1.5">
                <span className="truncate font-medium text-zinc-800">
                  {ingredient.productName}
                </span>
                <span className="text-zinc-400">
                  · {ingredient.unit} · Qty {formatQuantity(ingredient.quantity)}
                </span>
                {promotion ? (
                  <Badge tone={promotion.tone}>{promotion.label}</Badge>
                ) : null}
              </span>
              <span className="shrink-0 font-medium text-zinc-900">
                ${ingredient.lineCost.toFixed(2)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
