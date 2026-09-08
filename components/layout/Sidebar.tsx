"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  Tag,
  ChefHat,
  Sparkles,
  ListChecks,
  Package,
  User,
  Waves,
} from "lucide-react";
import RewardsSummary from "./RewardsSummary";

const LINKED_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/meal-plan", label: "Recipes & Meal Plans", icon: ChefHat },
  { href: "/account", label: "Your Account", icon: User },
];

const SOON_ITEMS = [
  { label: "Shop by Category", icon: LayoutGrid },
  { label: "Deals & Promotions", icon: Tag },
  { label: "Your Lists", icon: ListChecks },
  { label: "Orders", icon: Package },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-white lg:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
          <Waves className="h-5 w-5" strokeWidth={2} />
        </span>
        <span className="text-lg font-semibold text-zinc-900">
          Fresh<span className="text-emerald-600">Wave</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {LINKED_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                active
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}

        <Link
          href="/assistant"
          className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-semibold ${
            pathname === "/assistant"
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "border-emerald-200 bg-gradient-to-r from-emerald-50 to-white text-emerald-700 hover:border-emerald-300"
          }`}
        >
          <Sparkles className="h-4 w-4" strokeWidth={1.75} />
          FreshWave Assistant
        </Link>

        <div className="pt-2">
          {SOON_ITEMS.map(({ label, icon: Icon }) => (
            <span
              key={label}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-400"
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {label}
              </span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium">
                Soon
              </span>
            </span>
          ))}
        </div>
      </nav>

      <div className="p-3">
        <RewardsSummary />
      </div>
    </aside>
  );
}
