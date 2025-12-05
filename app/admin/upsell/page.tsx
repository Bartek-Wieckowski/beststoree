import { requireAdmin } from "@/lib/admin-guard";
import { getAllProductsForSelectWithStock } from "@/lib/actions/product.actions";
import { getUpsellForAdmin } from "@/lib/actions/upsell.actions";
import UpsellForm from "@/components/admin/UpsellForm";
import { Metadata } from "next";
import CONTENT_PAGE from "@/lib/content-page";

export const metadata: Metadata = {
  title: CONTENT_PAGE.PAGE.ADMIN_UPSELL.manageUpsell,
};

export default async function AdminUpsellPage() {
  await requireAdmin();

  const products = await getAllProductsForSelectWithStock();
  const currentUpsell = await getUpsellForAdmin();

  return (
    <div className="space-y-4">
      <h1 className="h2-bold">{CONTENT_PAGE.PAGE.ADMIN_UPSELL.manageUpsell}</h1>
      <UpsellForm products={products} currentUpsell={currentUpsell} />
    </div>
  );
}
