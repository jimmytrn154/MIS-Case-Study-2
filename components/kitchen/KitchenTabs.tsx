"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Refrigerator, Warehouse } from "lucide-react";

const TABS = [
  { href: "/my-kitchen/smart-fridge", label: "Smart Fridge", icon: Refrigerator },
  { href: "/my-kitchen/pantry", label: "Virtual Pantry", icon: Warehouse },
];

export default function KitchenTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="My Kitchen" className="flex gap-2 overflow-x-auto pb-1">
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold ${
              active
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-emerald-300"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
