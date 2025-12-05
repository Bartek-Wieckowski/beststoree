import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderSummary } from "@/lib/actions/order.actions";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils";
import {
  BadgeDollarSign,
  Barcode,
  CreditCard,
  Users,
  Tag,
  Ticket,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-guard";
import CONTENT_PAGE from "@/lib/content-page";
import ROUTES from "@/lib/routes";
import Charts from "./Charts";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminOverviewPage() {
  await requireAdmin();

  const summary = await getOrderSummary();

  return (
    <div className="space-y-2">
      <h1 className="h2-bold">{CONTENT_PAGE.PAGE.ADMIN_OVERVIEW.title}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {CONTENT_PAGE.PAGE.ADMIN_OVERVIEW.totalRevenue}
            </CardTitle>
            <BadgeDollarSign />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                summary.totalSales._sum.totalPrice?.toString() || 0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {CONTENT_PAGE.PAGE.ADMIN_OVERVIEW.sales}
            </CardTitle>
            <CreditCard />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.ordersCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {CONTENT_PAGE.PAGE.ADMIN_OVERVIEW.customers}
            </CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.usersCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {CONTENT_PAGE.PAGE.ADMIN_OVERVIEW.products}
            </CardTitle>
            <Barcode />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.productsCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {CONTENT_PAGE.PAGE.ADMIN_OVERVIEW.promotions}
            </CardTitle>
            <Tag />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.promotionsCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {CONTENT_PAGE.PAGE.ADMIN_OVERVIEW.coupons}
            </CardTitle>
            <Ticket />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.couponsCount)}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{CONTENT_PAGE.PAGE.ADMIN_OVERVIEW.overview}</CardTitle>
          </CardHeader>
          <CardContent>
            <Charts
              data={{
                salesData: summary.salesData,
              }}
            />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>
              {CONTENT_PAGE.PAGE.ADMIN_OVERVIEW.recentSales}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{CONTENT_PAGE.GLOBAL.buyer}</TableHead>
                  <TableHead>{CONTENT_PAGE.GLOBAL.date}</TableHead>
                  <TableHead>{CONTENT_PAGE.GLOBAL.total}</TableHead>
                  <TableHead>{CONTENT_PAGE.GLOBAL.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.latestSales.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order?.user?.name
                        ? order.user.name
                        : CONTENT_PAGE.PAGE.ADMIN_OVERVIEW.deletedUser}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(order.createdAt).dateOnly}
                    </TableCell>
                    <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                    <TableCell>
                      <Link href={ROUTES.ORDER(order.id)}>
                        <span className="px-2">
                          {CONTENT_PAGE.GLOBAL.details}
                        </span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
