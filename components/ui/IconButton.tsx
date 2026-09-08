import type { ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

export default function IconButton({
  icon: Icon,
  label,
  badgeCount,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: LucideIcon;
  label: string;
  badgeCount?: number;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100 hover:text-emerald-700 ${className}`}
      {...props}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
      {badgeCount ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-semibold text-white">
          {badgeCount}
        </span>
      ) : null}
    </button>
  );
}
