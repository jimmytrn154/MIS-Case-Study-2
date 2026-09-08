"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function AssistantFab() {
  const pathname = usePathname();

  if (pathname === "/assistant") return null;

  return (
    <Link
      href="/assistant"
      className="fixed bottom-6 right-6 z-20 hidden items-center gap-2 rounded-full bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 hover:bg-zinc-800 lg:flex"
    >
      <Sparkles className="h-4 w-4 text-emerald-400" strokeWidth={2} />
      FreshWave Assistant
    </Link>
  );
}
