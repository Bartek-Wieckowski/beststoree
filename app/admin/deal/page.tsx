import { requireAdmin } from "@/lib/admin-guard";
import {
  getAllProductsForSelect,
  getDealProduct,
} from "@/lib/actions/product.actions";
import DealForm from "@/components/admin/DealForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Deal Product",
};

export default async function AdminDealPage() {
  await requireAdmin();

  const products = await getAllProductsForSelect();
  const currentDeal = await getDealProduct();

  return (
    <div className="space-y-4">
      <h1 className="h2-bold">Manage Deal Product</h1>
      <DealForm products={products} currentDeal={currentDeal} />
    </div>
  );
}

