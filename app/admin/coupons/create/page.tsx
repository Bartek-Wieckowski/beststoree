import { Metadata } from "next";
import CouponForm from "@/components/admin/CouponForm";
import { requireAdmin } from "@/lib/admin-guard";
import CONTENT_PAGE from "@/lib/content-page";

export const metadata: Metadata = {
  title: "Create Coupon",
};

export default async function CreateCouponPage() {
  await requireAdmin();

  return (
    <>
      <h2 className="h2-bold">
        {CONTENT_PAGE.PAGE.ADMIN_COUPONS.createCoupon}
      </h2>
      <div className="my-8">
        <CouponForm type="Create" />
      </div>
    </>
  );
}
