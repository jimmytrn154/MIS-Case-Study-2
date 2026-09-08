import HeroBanner from "@/components/grocery/HeroBanner";
import PromoRow from "@/components/grocery/PromoRow";
import ProductCatalog from "@/components/grocery/ProductCatalog";
import Greeting from "@/components/grocery/Greeting";
import QuickActions from "@/components/assistant/QuickActions";
import AssistantPanel from "@/components/assistant/AssistantPanel";
import CartSummaryPanel from "@/components/cart/CartSummaryPanel";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

export default function HomePage() {
  return (
    <div className="flex gap-6">
      <div className="min-w-0 flex-1 space-y-6">
        <Greeting />
        <HeroBanner />
        <div className="xl:hidden">
          <QuickActions variant="grid" />
        </div>
        <PromoRow />
        <ProductCatalog categories={categories} products={products} />
      </div>

      <aside className="sticky top-20 hidden h-fit w-80 shrink-0 space-y-4 xl:block">
        <AssistantPanel />
        <CartSummaryPanel />
      </aside>
    </div>
  );
}
