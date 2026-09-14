import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-zinc-100 bg-white p-8 text-center">
      <h1 className="text-xl font-semibold text-zinc-900">Product not found</h1>
      <p className="mt-2 text-sm text-zinc-500">This product is not part of the Riverside demo catalog.</p>
      <Link href="/" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white">
        Return to products
      </Link>
    </div>
  );
}
