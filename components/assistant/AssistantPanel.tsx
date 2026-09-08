import Link from "next/link";
import { Sparkles, CalendarRange, BadgePercent, Salad } from "lucide-react";

const QUICK_ACTIONS = [
  { label: "Plan tonight's dinner", icon: Salad },
  { label: "Build a week of lunches", icon: CalendarRange },
  { label: "Find this week's best deals", icon: BadgePercent },
];

export default function AssistantPanel() {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
          <Sparkles className="h-4 w-4" strokeWidth={2} />
        </span>
        <h2 className="text-sm font-semibold text-zinc-900">
          FreshWave Assistant
        </h2>
      </div>
      <p className="mt-2 text-xs text-zinc-600">
        Personalized meal plans from Riverside&apos;s live inventory and
        promotions — ready to become a cart.
      </p>

      <div className="mt-3 space-y-1.5">
        {QUICK_ACTIONS.map(({ label, icon: Icon }) => (
          <Link
            key={label}
            href="/assistant"
            className="flex items-center gap-2 rounded-xl border border-zinc-100 bg-white px-3 py-2 text-xs font-medium text-zinc-700 hover:border-emerald-200 hover:text-emerald-700"
          >
            <Icon className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={1.75} />
            {label}
          </Link>
        ))}
      </div>

      <Link
        href="/assistant"
        className="mt-3 flex w-full items-center justify-center rounded-full bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        Open Assistant
      </Link>
    </div>
  );
}
