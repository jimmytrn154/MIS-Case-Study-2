import { Minus, Plus, Trash2 } from "lucide-react";

export default function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  incrementDisabled = false,
  className = "",
}: {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  incrementDisabled?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-full bg-emerald-600 text-white ${className}`}
    >
      <button
        type="button"
        onClick={onDecrement}
        aria-label={quantity === 1 ? "Remove from cart" : "Decrease quantity"}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-emerald-700"
      >
        {quantity === 1 ? (
          <Trash2 className="h-4 w-4" strokeWidth={1.75} />
        ) : (
          <Minus className="h-4 w-4" strokeWidth={2} />
        )}
      </button>
      <span className="min-w-6 text-center text-sm font-semibold">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={incrementDisabled}
        aria-label="Increase quantity"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}
