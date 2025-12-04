import { Metadata } from "next";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin-guard";
import CONTENT_PAGE from "@/lib/content-page";
import { getAllCategories } from "@/lib/actions/category.actions";

export const metadata: Metadata = {
  title: "Create Product",
};

export default async function CreateProductPage() {
  await requireAdmin();

  const categories = await getAllCategories();

  return (
    <>
      <h2 className="h2-bold">
        {CONTENT_PAGE.PAGE.ADMIN_PRODUCTS_CREATE.createProduct}
      </h2>
      <div className="my-8">
        <ProductForm type="Create" categories={categories} />
      </div>
    </>
  );
}
