import { requireAdmin } from "@/lib/admin-guard";
import { getAllProductsForSelectWithStock } from "@/lib/actions/product.actions";
import { getAllCategories } from "@/lib/actions/category.actions";
import { getAllPresellsForAdmin } from "@/lib/actions/presell.actions";
import PresellForm from "@/components/admin/PresellForm";
import { Metadata } from "next";
import CONTENT_PAGE from "@/lib/content-page";

export const metadata: Metadata = {
  title: CONTENT_PAGE.PAGE.ADMIN_PRESELL.managePresell,
};

export default async function AdminPresellPage() {
  await requireAdmin();

  const categories = await getAllCategories();
  const products = await getAllProductsForSelectWithStock();
  const currentPresells = await getAllPresellsForAdmin();

  return (
    <div className="space-y-4">
      <h1 className="h2-bold">
        {CONTENT_PAGE.PAGE.ADMIN_PRESELL.managePresell}
      </h1>
      <PresellForm
        categories={categories}
        products={products}
        currentPresells={currentPresells}
      />
    </div>
  );
}
