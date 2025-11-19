import { Metadata } from "next";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/shared/Pagination";
import { getMyOrders } from "@/lib/actions/order.actions";
import ROUTES from "@/lib/routes";
import CONTENT_PAGE from "@/lib/content-page";

export const metadata: Metadata = {
  title: "My Orders",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const { page } = await searchParams;
  const orders = await getMyOrders({ page: Number(page) || 1 });

  return (
    <div className="space-y-2">
      <h2 className="h2-bold">{CONTENT_PAGE.USER_ORDERS_PAGE.orders}</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{CONTENT_PAGE.USER_ORDERS_PAGE.orderId}</TableHead>
              <TableHead>{CONTENT_PAGE.USER_ORDERS_PAGE.date}</TableHead>
              <TableHead>{CONTENT_PAGE.USER_ORDERS_PAGE.total}</TableHead>
              <TableHead>{CONTENT_PAGE.USER_ORDERS_PAGE.paid}</TableHead>
              <TableHead>{CONTENT_PAGE.USER_ORDERS_PAGE.delivered}</TableHead>
              <TableHead>{CONTENT_PAGE.USER_ORDERS_PAGE.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : CONTENT_PAGE.USER_ORDERS_PAGE.notPaid}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : CONTENT_PAGE.USER_ORDERS_PAGE.notDelivered}
                </TableCell>
                <TableCell>
                  <Link href={ROUTES.ORDER(order.id)}>
                    <span className="px-2">Details</span>
                  </Link>
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
