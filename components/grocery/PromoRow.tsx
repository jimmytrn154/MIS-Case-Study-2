import Link from "next/link";
import { promoBanners } from "@/data/promo-banners";
import type { PromoBanner } from "@/types/grocery";

const TONE_CLASSES: Record<PromoBanner["tone"], string> = {
  brand: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white",
  deal: "bg-gradient-to-br from-orange-500 to-red-500 text-white",
  pickup: "bg-gradient-to-br from-sky-500 to-blue-600 text-white",
};

const CTA_CLASSES: Record<PromoBanner["tone"], string> = {
  brand: "bg-white/15 hover:bg-white/25",
  deal: "bg-white/20 hover:bg-white/30",
  pickup: "bg-white/20 hover:bg-white/30",
};

export default function PromoRow() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {promoBanners.map((promo) => (
        <div
          key={promo.id}
          className={`flex flex-col justify-between rounded-2xl p-5 ${TONE_CLASSES[promo.tone]}`}
        >
          <div>
            <h3 className="text-base font-semibold sm:text-lg">
              {promo.title}
            </h3>
            <p className="mt-1.5 text-sm text-white/85">{promo.description}</p>
          </div>
          {promo.href ? (
            <Link
              href={promo.href}
              className={`mt-4 w-fit rounded-full px-3 py-1.5 text-xs font-medium ${CTA_CLASSES[promo.tone]}`}
            >
              {promo.ctaLabel}
            </Link>
          ) : (
            <span
              className={`mt-4 w-fit rounded-full px-3 py-1.5 text-xs font-medium ${CTA_CLASSES[promo.tone]}`}
            >
              {promo.ctaLabel}
            </span>
          )}
        </div>
      ))}
    </section>
  );
}
