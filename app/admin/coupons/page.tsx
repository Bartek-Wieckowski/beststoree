import Link from "next/link";
import { getAllCoupons, deleteCoupon } from "@/lib/actions/coupon.actions";
import { formatId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteDialog from "@/components/DeleteDialog";
import { requireAdmin } from "@/lib/admin-guard";
import ROUTES from "@/lib/routes";
import CONTENT_PAGE from "@/lib/content-page";
import { Badge } from "@/components/ui/badge";

export default async function AdminCouponsPage() {
  await requireAdmin();

  const coupons = await getAllCoupons();

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">{CONTENT_PAGE.PAGE.ADMIN_COUPONS.coupons}</h1>
        <Button asChild variant="default" data-testid="create-coupon-button">
          <Link href={ROUTES.ADMIN_COUPONS_CREATE}>
            {CONTENT_PAGE.PAGE.ADMIN_COUPONS.createCoupon}
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>{CONTENT_PAGE.PAGE.ADMIN_COUPONS.code}</TableHead>
            <TableHead>
              {CONTENT_PAGE.PAGE.ADMIN_COUPONS.discountPercentage}
            </TableHead>
            <TableHead>{CONTENT_PAGE.PAGE.ADMIN_COUPONS.startDate}</TableHead>
            <TableHead>{CONTENT_PAGE.PAGE.ADMIN_COUPONS.endDate}</TableHead>
            <TableHead>{CONTENT_PAGE.PAGE.ADMIN_COUPONS.isEnabled}</TableHead>
            <TableHead className="w-[6.25rem]">
              {CONTENT_PAGE.GLOBAL.actions}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                {CONTENT_PAGE.PAGE.ADMIN_COUPONS.noCouponsFound}
              </TableCell>
            </TableRow>
          ) : (
            coupons.map((coupon) => {
              const now = new Date();
              const startDate = new Date(coupon.startDate);
              const endDate = new Date(coupon.endDate);
              const isActive =
                coupon.isEnabled && now >= startDate && now <= endDate;

              return (
                <TableRow key={coupon.id}>
                  <TableCell>{formatId(coupon.id)}</TableCell>
                  <TableCell>
                    <span className="font-mono font-semibold">
                      {coupon.code}
                    </span>
                  </TableCell>
                  <TableCell>{Number(coupon.discountPercentage)}%</TableCell>
                  <TableCell>
                    {new Date(coupon.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(coupon.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={isActive ? "default" : "secondary"}>
                      {isActive
                        ? CONTENT_PAGE.PAGE.ADMIN_COUPONS.active
                        : CONTENT_PAGE.PAGE.ADMIN_COUPONS.inactive}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <Button asChild variant="outline" size="sm">
                      <Link href={ROUTES.ADMIN_COUPONS_EDIT(coupon.id)}>
                        {CONTENT_PAGE.GLOBAL.edit}
                      </Link>
                    </Button>
                    <DeleteDialog id={coupon.id} action={deleteCoupon} />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
