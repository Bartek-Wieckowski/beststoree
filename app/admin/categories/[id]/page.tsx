import CategoryForm from "@/components/admin/CategoryForm";
import { getCategoryById } from "@/lib/actions/category.actions";
import { requireAdmin } from "@/lib/admin-guard";
import CONTENT_PAGE from "@/lib/content-page";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Update Category",
};

export default async function AdminCategoryUpdatePage(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  await requireAdmin();

  const { id } = await props.params;

  const category = await getCategoryById(id);

  if (!category) return notFound();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">
        {CONTENT_PAGE.PAGE.ADMIN_CATEGORIES.updateCategory}
      </h1>

      <CategoryForm
        type="Update"
        category={category}
        categoryId={category.id}
      />
    </div>
  );
}
