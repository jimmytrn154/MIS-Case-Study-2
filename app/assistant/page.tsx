import { Sparkles } from "lucide-react";

export default function AssistantPage() {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-100 bg-white p-8 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
        <Sparkles className="h-6 w-6" strokeWidth={2} />
      </span>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-900">
        FreshWave Assistant
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        Chat with the assistant about household size, budget, dietary
        restrictions, and preferences to generate a meal plan. This page is a
        placeholder — the assistant is not connected yet.
      </p>
    </div>
  );
}
