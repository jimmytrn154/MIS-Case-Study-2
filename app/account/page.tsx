import { Award, Store, Heart, Leaf } from "lucide-react";
import { demoCustomer } from "@/data/customer";
import { currentStore } from "@/data/store";

export default function AccountPage() {
  const { name, householdSize, memberSince, preferences, dietaryRestrictions, loyalty } =
    demoCustomer;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-xl font-semibold text-white">
          {name.charAt(0)}
        </span>
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">{name}</h1>
          <p className="text-xs text-zinc-500">
            Member since {memberSince} · Household of {householdSize}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
        <div className="flex items-center gap-2 text-emerald-800">
          <Award className="h-4 w-4" strokeWidth={1.75} />
          <span className="text-sm font-semibold">Rewards</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-emerald-700">Points</p>
            <p className="text-lg font-semibold text-zinc-900">
              {loyalty.points.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-emerald-700">Saved this month</p>
            <p className="text-lg font-semibold text-zinc-900">
              ${loyalty.monthlySavings.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white p-4">
        <div className="flex items-center gap-2 text-zinc-700">
          <Heart className="h-4 w-4" strokeWidth={1.75} />
          <span className="text-sm font-semibold text-zinc-900">Preferences</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {preferences.map((preference) => (
            <span
              key={preference}
              className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600"
            >
              {preference}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white p-4">
        <div className="flex items-center gap-2 text-zinc-700">
          <Leaf className="h-4 w-4" strokeWidth={1.75} />
          <span className="text-sm font-semibold text-zinc-900">
            Dietary restrictions
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {dietaryRestrictions.length > 0 ? (
            dietaryRestrictions.map((restriction) => (
              <span
                key={restriction}
                className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600"
              >
                {restriction}
              </span>
            ))
          ) : (
            <p className="text-xs text-zinc-500">None set.</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white p-4 text-sm text-zinc-700">
        <Store className="h-5 w-5 shrink-0 text-emerald-600" strokeWidth={1.75} />
        <div>
          <p className="font-medium text-zinc-900">{currentStore.name}</p>
          <p className="text-xs text-zinc-500">
            {currentStore.address} · {currentStore.hoursLabel}
          </p>
        </div>
      </div>

      <p className="text-center text-xs text-zinc-400">
        This is a demo customer profile for the FreshWave prototype.
      </p>
    </div>
  );
}
