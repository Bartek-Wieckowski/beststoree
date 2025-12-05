import CouponForm from "@/components/admin/CouponForm";
import { getCouponById } from "@/lib/actions/coupon.actions";
import { requireAdmin } from "@/lib/admin-guard";
import CONTENT_PAGE from "@/lib/content-page";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Update Coupon",
};

export default async function AdminCouponUpdatePage(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  await requireAdmin();

  const { id } = await props.params;

  const coupon = await getCouponById(id);

  if (!coupon) return notFound();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">
        {CONTENT_PAGE.PAGE.ADMIN_COUPONS.updateCoupon}
      </h1>

      <CouponForm type="Update" coupon={coupon} couponId={coupon.id} />
    </div>
  );
}
