import type { ButtonHTMLAttributes } from "react";

const VARIANT_CLASSES = {
  primary: "bg-emerald-600 text-white hover:bg-emerald-700",
  secondary: "bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200",
  ghost: "bg-white/15 text-white hover:bg-white/25",
} as const;

type ButtonVariant = keyof typeof VARIANT_CLASSES;

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
