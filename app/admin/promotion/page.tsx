import { requireAdmin } from "@/lib/admin-guard";
import { getAllProductsForSelect } from "@/lib/actions/product.actions";
import { getPromotionForAdmin } from "@/lib/actions/promotion.actions";
import PromotionForm from "@/components/admin/PromotionForm";
import { Metadata } from "next";
import CONTENT_PAGE from "@/lib/content-page";

export const metadata: Metadata = {
  title: "Manage Promotion",
};

export default async function AdminPromotionPage() {
  await requireAdmin();

  const products = await getAllProductsForSelect();
  const currentPromotion = await getPromotionForAdmin();

  return (
    <div className="space-y-4">
      <h1 className="h2-bold">{CONTENT_PAGE.GLOBAL.managePromotion}</h1>
      <PromotionForm products={products} currentPromotion={currentPromotion} />
    </div>
  );
}
