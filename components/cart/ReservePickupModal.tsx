import { CheckCircle2, Clock, Store } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { currentStore } from "@/data/store";

export default function ReservePickupModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Pickup reserved">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-6 w-6" strokeWidth={1.75} />
        </span>

        <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-zinc-900">
          <Store className="h-4 w-4" strokeWidth={1.75} />
          {currentStore.name}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-600">
          <Clock className="h-4 w-4" strokeWidth={1.75} />
          Pickup estimate: approximately 30 minutes
        </p>

        <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
          Prototype demonstration only — no real order has been placed.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-full bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Done
        </button>
      </div>
    </Modal>
  );
}
