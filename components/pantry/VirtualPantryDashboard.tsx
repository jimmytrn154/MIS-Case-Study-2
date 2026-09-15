"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BadgePercent,
  CalendarClock,
  CheckCircle2,
  ChefHat,
  Clock3,
  PackagePlus,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { usePantry } from "@/components/pantry/PantryProvider";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { DEMO_TODAY } from "@/data/demo-date";
import { getPantryDaysRemaining } from "@/lib/pantry-core";
import { getAntiWasteOfferForProduct } from "@/lib/anti-waste";
import { formatQuantity } from "@/lib/format";
import { pantryRecipeSchema, type PantryRecipe } from "@/types/pantry-recipe";
import type { Product } from "@/types/grocery";
import type { PantryItem } from "@/types/intelligence";

const STATUS_LABEL = {
  fresh: "Fresh",
  "use-soon": "Use soon",
  expired: "Expired",
  "low-stock": "Running low",
} as const;

const STATUS_TONE = {
  fresh: "brand",
  "use-soon": "deal",
  expired: "deal",
  "low-stock": "info",
} as const;

function expiryLabel(item: PantryItem): string | null {
  if (!item.expiresAt) return null;
  const days = getPantryDaysRemaining(item.expiresAt, DEMO_TODAY);
  if (days < 0) return `Expired ${Math.abs(days)} ${Math.abs(days) === 1 ? "day" : "days"} ago`;
  if (days === 0) return "Expires today";
  if (days === 1) return "Expires tomorrow";
  return `Expires in ${days} days`;
}

function PantryCard({ item, product }: { item: PantryItem; product: Product }) {
  const expiry = expiryLabel(item);
  return (
    <article className="flex min-w-0 gap-3 rounded-2xl border border-zinc-100 bg-white p-4">
      <span aria-hidden className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
        {product.image}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <h3 className="font-semibold text-zinc-900">{product.name}</h3>
          <Badge tone={STATUS_TONE[item.status]}>{STATUS_LABEL[item.status]}</Badge>
        </div>
        <p className="mt-1 text-sm text-zinc-600">
          {formatQuantity(item.quantity)} {item.unit}
        </p>
        {expiry ? (
          <p className={`mt-1 flex items-center gap-1.5 text-xs ${item.status === "use-soon" || item.status === "expired" ? "font-medium text-red-600" : "text-zinc-500"}`}>
            <Clock3 className="h-3.5 w-3.5" /> {expiry}
          </p>
        ) : (
          <p className="mt-1 text-xs text-zinc-500">Shelf-stable pantry item</p>
        )}
      </div>
    </article>
  );
}

function PantrySection({
  title,
  description,
  icon,
  items,
  productById,
  emptyMessage,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  items: PantryItem[];
  productById: Map<string, Product>;
  emptyMessage: string;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 text-emerald-600">{icon}</span>
        <div>
          <h2 className="font-semibold text-zinc-900">{title}</h2>
          <p className="text-xs text-zinc-500">{description}</p>
        </div>
      </div>
      {items.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const product = productById.get(item.productId);
            return product ? <PantryCard key={item.id} item={item} product={product} /> : null;
          })}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-zinc-200 bg-white p-5 text-sm text-zinc-500">
          {emptyMessage}
        </p>
      )}
    </section>
  );
}

export default function VirtualPantryDashboard({ catalog }: { catalog: Product[] }) {
  const { items, consumeItems } = usePantry();
  const { addItem } = useCart();
  const productById = useMemo(
    () => new Map(catalog.map((product) => [product.id, product])),
    [catalog],
  );
  const [recipe, setRecipe] = useState<PantryRecipe | null>(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [recipeError, setRecipeError] = useState<string | null>(null);
  const [confirmingCooked, setConfirmingCooked] = useState(false);
  const [cookedMessage, setCookedMessage] = useState(false);
  const [restockAdded, setRestockAdded] = useState<Set<string>>(() => new Set());

  const useSoon = items.filter((item) => item.status === "use-soon" || item.status === "expired");
  const runningLow = items.filter((item) => item.status === "low-stock");
  const recentlyAdded = items.filter((item) => {
    const daysSince = -getPantryDaysRemaining(item.purchasedAt, DEMO_TODAY);
    return daysSince >= 0 && daysSince <= 3;
  });
  const recipeRestockDeals = recipe
    ? recipe.recipe.ingredients.flatMap((ingredient) => {
        const pantryItem = items.find((item) => item.id === ingredient.pantryItemId);
        const offer = getAntiWasteOfferForProduct(ingredient.productId);
        if (!pantryItem || !offer || ingredient.quantity < pantryItem.quantity) return [];
        return [{ ingredient, offer }];
      })
    : [];

  async function cookWithPantry() {
    setLoadingRecipe(true);
    setRecipeError(null);
    setCookedMessage(false);
    try {
      const prioritized = [...items]
        .filter((item) => item.quantity > 0 && item.status !== "expired")
        .sort((a, b) => Number(b.status === "use-soon") - Number(a.status === "use-soon"));
      const response = await fetch("/api/pantry-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pantryItems: prioritized }),
      });
      const body: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const message = body && typeof body === "object" && "error" in body && typeof body.error === "string"
          ? body.error
          : "FreshWave Assistant could not generate a pantry recipe.";
        throw new Error(message);
      }
      setRecipe(pantryRecipeSchema.parse(body));
    } catch (error) {
      setRecipeError(error instanceof Error ? error.message : "Could not generate a pantry recipe.");
    } finally {
      setLoadingRecipe(false);
    }
  }

  function markCooked() {
    if (!recipe) return;
    consumeItems(
      recipe.recipe.ingredients.map((ingredient) => ({
        pantryItemId: ingredient.pantryItemId,
        quantity: ingredient.quantity,
      })),
    );
    setConfirmingCooked(false);
    setRecipe(null);
    setCookedMessage(true);
  }

  function addRestock(productId: string) {
    addItem(productId);
    setRestockAdded((current) => new Set(current).add(productId));
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 to-emerald-50 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-violet-700">
              <Sparkles className="h-4 w-4" /> FreshWave Assistant
            </p>
            <h2 className="mt-1 text-xl font-semibold text-zinc-900">Cook with what I have</h2>
            <p className="mt-1 max-w-2xl text-sm text-zinc-600">
              Generate one recipe from real pantry quantities, prioritizing food marked Use Soon.
            </p>
          </div>
          <button
            type="button"
            onClick={cookWithPantry}
            disabled={loadingRecipe || items.every((item) => item.quantity <= 0)}
            className="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white hover:bg-violet-700 disabled:bg-zinc-300"
          >
            {loadingRecipe ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <ChefHat className="h-4 w-4" />}
            {loadingRecipe ? "Creating recipe…" : "Cook with what I have"}
          </button>
        </div>

        {recipeError ? <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{recipeError}</p> : null}
        {cookedMessage ? (
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-white p-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-5 w-5" /> Meal marked as cooked and pantry quantities updated.
          </p>
        ) : null}
        {recipe ? (
          <div className="mt-5 rounded-2xl bg-white p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">AI-generated recipe · pantry-grounded</p>
            <h3 className="mt-1 text-lg font-semibold text-zinc-900">{recipe.recipe.name}</h3>
            <p className="mt-1 text-sm text-zinc-600">{recipe.recipe.summary}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold text-zinc-900">From your pantry</h4>
                <ul className="mt-2 space-y-1.5 text-sm text-zinc-600">
                  {recipe.recipe.ingredients.map((ingredient) => (
                    <li key={ingredient.pantryItemId}>
                      {formatQuantity(ingredient.quantity)} {ingredient.unit} {ingredient.productName}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900">Method</h4>
                <ol className="mt-2 space-y-1.5 text-sm text-zinc-600">
                  {recipe.recipe.instructions.map((instruction, index) => (
                    <li key={`${index}-${instruction}`} className="flex gap-2">
                      <span className="font-semibold text-violet-600">{index + 1}.</span> {instruction}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            {recipeRestockDeals.length > 0 ? (
              <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3">
                <p className="flex items-center gap-2 text-sm font-semibold text-red-700">
                  <BadgePercent className="h-4 w-4" /> Anti-waste restock opportunity
                </p>
                {recipeRestockDeals.map(({ ingredient, offer }) => (
                  <div key={ingredient.pantryItemId} className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-700">
                    <span className="flex-1">
                      This recipe will finish your {ingredient.productName}. FreshWave has a {offer.discountPercent}% anti-waste offer at ${offer.discountedPrice.toFixed(2)}.
                    </span>
                    <button
                      type="button"
                      onClick={() => addRestock(ingredient.productId)}
                      className="min-h-11 rounded-full bg-red-600 px-4 text-xs font-semibold text-white hover:bg-red-700"
                    >
                      Add deal to cart
                    </button>
                  </div>
                ))}
                <p className="mt-2 text-xs text-red-600">Price and discount come from FreshWave data, not Gemini.</p>
              </div>
            ) : null}
            <button type="button" onClick={() => setConfirmingCooked(true)} className="mt-5 min-h-11 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700">
              Mark as Cooked
            </button>
          </div>
        ) : null}
      </section>

      <PantrySection title="Use Soon" description="Expired items and food within three days of expiry." icon={<AlertTriangle className="h-5 w-5" />} items={useSoon} productById={productById} emptyMessage="Nothing needs urgent attention." />
      <PantrySection title="Running Low" description="At or below the stored household threshold." icon={<CalendarClock className="h-5 w-5" />} items={runningLow} productById={productById} emptyMessage="No pantry items are currently running low." />
      <PantrySection title="Recently Added" description="Added during the last three demo days." icon={<PackagePlus className="h-5 w-5" />} items={recentlyAdded} productById={productById} emptyMessage="No recent pantry additions." />
      <PantrySection title="All Pantry Items" description="Sarah's complete at-home inventory." icon={<PackagePlus className="h-5 w-5" />} items={items} productById={productById} emptyMessage="The pantry is empty." />

      <section className="rounded-3xl border border-sky-100 bg-sky-50 p-5 sm:p-6">
        <h2 className="font-semibold text-zinc-900">Upcoming Restock</h2>
        <p className="mt-1 text-xs text-zinc-500">Low or depleted pantry items require confirmation before entering the cart.</p>
        {runningLow.length > 0 ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {runningLow.map((item) => {
              const product = productById.get(item.productId);
              if (!product) return null;
              const added = restockAdded.has(product.id);
              return (
                <li key={item.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-3">
                  <span aria-hidden className="text-2xl">{product.image}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-900">{product.name}</p>
                    <p className="text-xs text-zinc-500">{formatQuantity(item.quantity)} {item.unit} remaining</p>
                  </div>
                  <button type="button" onClick={() => addRestock(product.id)} disabled={added} className="min-h-11 w-full shrink-0 rounded-full bg-sky-600 px-3 text-xs font-semibold text-white disabled:bg-emerald-600 min-[430px]:w-auto">
                    {added ? "Added" : "Add to cart"}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : <p className="mt-4 text-sm text-zinc-500">No upcoming restock items.</p>}
        {restockAdded.size > 0 ? <Link href="/cart" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-sky-700 underline underline-offset-2">Review cart</Link> : null}
      </section>

      <Modal open={confirmingCooked} onClose={() => setConfirmingCooked(false)} title="Mark this meal as cooked?">
        <p className="text-sm text-zinc-600">This will use:</p>
        <ul className="mt-3 space-y-2 rounded-xl bg-zinc-50 p-3 text-sm text-zinc-700">
          {recipe?.recipe.ingredients.map((ingredient) => (
            <li key={ingredient.pantryItemId}>
              {formatQuantity(ingredient.quantity)} {ingredient.unit} {ingredient.productName}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-zinc-500">Quantities are capped at what Sarah currently has and can never become negative.</p>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => setConfirmingCooked(false)} className="min-h-11 flex-1 rounded-full border border-zinc-200 text-sm font-semibold text-zinc-700">Cancel</button>
          <button type="button" onClick={markCooked} className="min-h-11 flex-1 rounded-full bg-emerald-600 text-sm font-semibold text-white">Confirm cooked</button>
        </div>
      </Modal>
    </div>
  );
}
