import { Metadata } from "next";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin-guard";
import CONTENT_PAGE from "@/lib/content-page";

export const metadata: Metadata = {
  title: "Create Product",
};

export default async function CreateProductPage() {
  await requireAdmin();

  return (
    <>
      <h2 className="h2-bold">
        {CONTENT_PAGE.ADMIN_PRODUCTS_CREATE_PAGE.createProduct}
      </h2>
      <div className="my-8">
        <ProductForm type="Create" />
      </div>
    </>
  );
}
