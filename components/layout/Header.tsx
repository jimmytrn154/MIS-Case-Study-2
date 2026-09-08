import { Heart, ReceiptText, ShoppingCart, UserCircle, Waves } from "lucide-react";
import IconButton from "@/components/ui/IconButton";
import StoreSelector from "./StoreSelector";
import SearchField from "./SearchField";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white">
      <div className="flex flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:gap-4 lg:py-4">
        <div className="flex items-center justify-between gap-3 lg:contents">
          <div className="flex items-center gap-2 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Waves className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="font-semibold text-zinc-900">
              Fresh<span className="text-emerald-600">Wave</span>
            </span>
          </div>

          <StoreSelector />

          <div className="flex items-center gap-1 lg:hidden">
            <IconButton icon={ShoppingCart} label="Cart" badgeCount={3} />
            <IconButton icon={UserCircle} label="Your account" />
          </div>
        </div>

        <SearchField className="lg:order-none" />

        <div className="hidden items-center gap-1 lg:flex">
          <IconButton icon={Heart} label="Favorites" />
          <IconButton icon={ReceiptText} label="Orders" />
          <IconButton icon={ShoppingCart} label="Cart" badgeCount={3} />
          <IconButton icon={UserCircle} label="Your account" />
        </div>
      </div>
    </header>
  );
}
