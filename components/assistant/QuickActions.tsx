import Link from "next/link";
import { Salad, BadgePercent, Wallet } from "lucide-react";

export const QUICK_ACTIONS = [
  { label: "Plan my meals", icon: Salad },
  { label: "Today's deals", icon: BadgePercent },
  { label: "Shop under a budget", icon: Wallet },
];

/**
 * Shared quick-action shortcuts into the Assistant. "list" (compact vertical
 * rows) is used in the desktop right-rail panel; "grid" (3 equal tiles) is
 * used inline on the mobile home screen, where there is no right rail.
 */
export default function QuickActions({
  variant = "list",
}: {
  variant?: "list" | "grid";
}) {
  if (variant === "grid") {
    return (
      <div className="grid grid-cols-3 gap-2">
        {QUICK_ACTIONS.map(({ label, icon: Icon }) => (
          <Link
            key={label}
            href="/assistant"
            className="flex flex-col items-center gap-1.5 rounded-xl border border-zinc-100 bg-white px-2 py-3 text-center text-xs font-medium text-zinc-700 hover:border-emerald-200 hover:text-emerald-700"
          >
            <Icon className="h-5 w-5 text-emerald-600" strokeWidth={1.75} />
            {label}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
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
  );
}
