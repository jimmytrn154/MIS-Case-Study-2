import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, PackageCheck, Star } from "lucide-react";
import ProductDetailActions from "@/components/grocery/ProductDetailActions";
import ProductTraceability from "@/components/traceability/ProductTraceability";
import Badge from "@/components/ui/Badge";
import { farms } from "@/data/farms";
import { products } from "@/data/products";
import { currentStore } from "@/data/store";
import { getTraceabilityRecord } from "@/lib/traceability";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((candidate) => candidate.id === id);
  if (!product) notFound();

  const traceability = getTraceabilityRecord(product.id);
  const farm = traceability
    ? farms.find((candidate) => candidate.id === traceability.farmId)
    : undefined;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-emerald-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>

      <section className="grid gap-5 rounded-3xl border border-zinc-100 bg-white p-4 sm:p-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="flex min-h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-violet-50 text-8xl sm:min-h-80">
          <span aria-hidden>{product.image}</span>
        </div>
        <div className="flex min-w-0 flex-col justify-center">
          <div className="flex flex-wrap gap-2">
            {product.farmId ? (
              <Badge tone="brand"><MapPin className="h-3 w-3" /> Traceable origin</Badge>
            ) : null}
            {product.tags.slice(0, 4).map((tag) => (
              <Badge key={tag}>{tag.replaceAll("-", " ")}</Badge>
            ))}
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {product.category.replaceAll("-", " & ")}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-zinc-900 sm:text-3xl">{product.name}</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            {product.description ?? `Available now at ${currentStore.name}.`}
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {product.rating} · {product.reviewCount.toLocaleString()} reviews
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700">
              <PackageCheck className="h-4 w-4" /> {product.stock} in stock · {product.storeLocation.shelfZone}
            </span>
          </div>
          <div className="mt-5">
            <ProductDetailActions product={product} />
          </div>
        </div>
      </section>

      {traceability && farm ? (
        <ProductTraceability
          product={product}
          farm={farm}
          store={currentStore}
          record={traceability}
        />
      ) : (
        <section className="rounded-2xl border border-zinc-100 bg-white p-5 text-sm text-zinc-500">
          Detailed local-producer traceability is not available for this product category.
        </section>
      )}
    </div>
  );
}
