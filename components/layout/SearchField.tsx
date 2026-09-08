import { Search } from "lucide-react";

export default function SearchField({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex-1 lg:max-w-xl ${className}`}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
        strokeWidth={1.75}
      />
      <input
        type="search"
        placeholder="Search what's on the shelf, or ask the Assistant"
        className="w-full rounded-full border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-4 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}
