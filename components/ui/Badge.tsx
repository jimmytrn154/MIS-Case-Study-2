import type { ReactNode } from "react";

const TONE_CLASSES = {
  brand: "bg-emerald-50 text-emerald-700",
  deal: "bg-red-50 text-red-600",
  neutral: "bg-zinc-100 text-zinc-600",
  info: "bg-blue-50 text-blue-600",
} as const;

export type BadgeTone = keyof typeof TONE_CLASSES;

export default function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
