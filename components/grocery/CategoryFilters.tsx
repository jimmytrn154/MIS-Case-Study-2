import type { Category } from "@/types/grocery";
import { CATEGORY_ICONS } from "./category-icons";

export default function CategoryFilters({
  categories,
  selectedId,
  onSelect,
}: {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((category) => {
        const Icon = CATEGORY_ICONS[category.icon] ?? CATEGORY_ICONS["layout-grid"];
        const active = category.id === selectedId;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-emerald-200 hover:text-emerald-700"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
