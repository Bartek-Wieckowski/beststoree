import { Metadata } from "next";
import CategoryForm from "@/components/admin/CategoryForm";
import { requireAdmin } from "@/lib/admin-guard";

export const metadata: Metadata = {
  title: "Create Category",
};

export default async function CreateCategoryPage() {
  await requireAdmin();

  return (
    <>
      <h2 className="h2-bold">Create Category</h2>
      <div className="my-8">
        <CategoryForm type="Create" />
      </div>
    </>
  );
}
