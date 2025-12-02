import ProductForm from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/actions/product.actions";
import { getAllCategories } from "@/lib/actions/category.actions";
import { requireAdmin } from "@/lib/admin-guard";
import CONTENT_PAGE from "@/lib/content-page";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Update Product",
};

export default async function AdminProductUpdatePage(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  await requireAdmin();

  const { id } = await props.params;

  const product = await getProductById(id);
  const categories = await getAllCategories();

  if (!product) return notFound();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">
        {CONTENT_PAGE.ADMIN_PRODUCTS_UPDATE_PAGE.updateProduct}
      </h1>

      <ProductForm
        type="Update"
        product={product}
        productId={product.id}
        categories={categories}
      />
    </div>
  );
}
