"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ChefHat, Sparkles, ShoppingCart } from "lucide-react";

const ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/meal-plan", label: "Meal Plan", icon: ChefHat },
  { href: "/assistant", label: "Assistant", icon: Sparkles },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex items-stretch justify-around border-t border-zinc-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        const isAssistant = href === "/assistant";

        if (isAssistant) {
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center justify-end gap-1 py-2 text-xs font-medium text-emerald-700"
            >
              <span
                className={`-mt-6 flex h-12 w-12 items-center justify-center rounded-full shadow-lg shadow-emerald-600/30 ${
                  active ? "bg-emerald-700" : "bg-emerald-600"
                }`}
              >
                <Icon className="h-5 w-5 text-white" strokeWidth={2} />
              </span>
              {label}
            </Link>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-medium ${
              active ? "text-emerald-700" : "text-zinc-500"
            }`}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
