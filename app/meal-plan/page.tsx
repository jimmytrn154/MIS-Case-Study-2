import { ChefHat } from "lucide-react";

export default function MealPlanPage() {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-100 bg-white p-8 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
        <ChefHat className="h-6 w-6" strokeWidth={2} />
      </span>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-900">Meal Plan</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Your generated meal plan, estimated costs, and savings will appear
        here. This page is a placeholder — no meal plan has been generated
        yet.
      </p>
    </div>
  );
}
