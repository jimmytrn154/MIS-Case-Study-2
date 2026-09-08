"use client";

import { useState } from "react";
import type { Category, Product } from "@/types/grocery";
import CategoryFilters from "./CategoryFilters";
import ProductGrid from "./ProductGrid";

export default function ProductCatalog({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const [selectedId, setSelectedId] = useState(categories[0]?.id ?? "all");

  const filtered =
    selectedId === "all"
      ? products
      : products.filter((product) => product.categoryId === selectedId);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900">
          Featured products
        </h2>
        <span className="text-sm text-zinc-500">
          {filtered.length} items
        </span>
      </div>
      <CategoryFilters
        categories={categories}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <ProductGrid products={filtered} />
    </section>
  );
}
