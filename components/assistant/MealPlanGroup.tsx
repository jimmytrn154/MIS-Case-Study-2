import MealPlanCard from "./MealPlanCard";
import MealPlanSummary from "./MealPlanSummary";
import MealPlanShoppingList from "./MealPlanShoppingList";
import type { Meal } from "@/types/meal-plan";

export default function MealPlanGroup({
  mealPlan,
  estimatedTotal,
  estimatedSavings,
  budget,
  addedToCart,
  onAddedToCart,
}: {
  mealPlan: Meal[];
  estimatedTotal: number;
  estimatedSavings: number;
  budget?: number;
  addedToCart: boolean;
  onAddedToCart: () => void;
}) {
  if (mealPlan.length === 0) return null;

  return (
    <div className="ml-9 space-y-3">
      <MealPlanSummary
        estimatedTotal={estimatedTotal}
        estimatedSavings={estimatedSavings}
        budget={budget}
      />
      <div className="space-y-3">
        {mealPlan.map((meal, index) => (
          <MealPlanCard key={`${meal.day}-${index}`} meal={meal} />
        ))}
      </div>
      <MealPlanShoppingList
        mealPlan={mealPlan}
        added={addedToCart}
        onAdded={onAddedToCart}
      />
    </div>
  );
}
