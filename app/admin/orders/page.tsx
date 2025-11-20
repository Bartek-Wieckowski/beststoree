import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllOrders, deleteOrder } from "@/lib/actions/order.actions";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Pagination from "@/components/shared/Pagination";
import DeleteDialog from "@/components/DeleteDialog";
import { requireAdmin } from "@/lib/admin-guard";
import CONTENT_PAGE from "@/lib/content-page";
import ROUTES from "@/lib/routes";

export const metadata: Metadata = {
  title: "Admin Orders",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string; query: string }>;
}) {
  await requireAdmin();

  const { page = "1", query: searchText } = await searchParams;

  const orders = await getAllOrders({
    page: Number(page),
    query: searchText,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="h2-bold">{CONTENT_PAGE.ADMIN_ORDERS_PAGE.orders}</h1>
        {searchText && (
          <div>
            {CONTENT_PAGE.ADMIN_ORDERS_PAGE.filteredBy}{" "}
            <i>&quot;{searchText}&quot;</i>{" "}
            <Link href={ROUTES.ADMIN_ORDERS}>
              <Button variant="outline" size="sm">
                {CONTENT_PAGE.ADMIN_ORDERS_PAGE.removeFilter}
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{CONTENT_PAGE.ADMIN_ORDERS_PAGE.orderId}</TableHead>
              <TableHead>{CONTENT_PAGE.ADMIN_ORDERS_PAGE.date}</TableHead>
              <TableHead>{CONTENT_PAGE.ADMIN_ORDERS_PAGE.buyer}</TableHead>
              <TableHead>{CONTENT_PAGE.ADMIN_ORDERS_PAGE.total}</TableHead>
              <TableHead>{CONTENT_PAGE.ADMIN_ORDERS_PAGE.paid}</TableHead>
              <TableHead>{CONTENT_PAGE.ADMIN_ORDERS_PAGE.delivered}</TableHead>
              <TableHead>{CONTENT_PAGE.ADMIN_ORDERS_PAGE.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : CONTENT_PAGE.ADMIN_ORDERS_PAGE.notPaid}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : CONTENT_PAGE.ADMIN_ORDERS_PAGE.notDelivered}
                </TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={ROUTES.ORDER(order.id)}>
                      {CONTENT_PAGE.ADMIN_ORDERS_PAGE.details}
                    </Link>
                  </Button>
                  <DeleteDialog id={order.id} action={deleteOrder} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination
            page={Number(page) || 1}
            totalPages={orders?.totalPages}
          />
        )}
      </div>
    </div>
  );
}
