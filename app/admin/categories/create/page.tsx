import { Metadata } from "next";
import CategoryForm from "@/components/admin/CategoryForm";
import { requireAdmin } from "@/lib/admin-guard";
import CONTENT_PAGE from "@/lib/content-page";

export const metadata: Metadata = {
  title: "Create Category",
};

export default async function CreateCategoryPage() {
  await requireAdmin();

  return (
    <>
      <h2 className="h2-bold">
        {CONTENT_PAGE.PAGE.ADMIN_CATEGORIES.createCategory}
      </h2>
      <div className="my-8">
        <CategoryForm type="Create" />
      </div>
    </>
  );
}
