"use client";

import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import Image from "next/image";
import Link from "next/link";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import {
  createPayPalOrder,
  approvePayPalOrder,
  deliverOrder,
  updateOrderToPaidCOD,
} from "@/lib/actions/order.actions";
import { toast, useToast } from "@/hooks/use-toast";
import CONTENT_PAGE from "@/lib/content-page";
import ROUTES from "@/lib/routes";
import { useTransition } from "react";

export default function OrderDetailsTable({
  order,
  paypalClientId,
  isAdmin,
}: {
  order: Order;
  paypalClientId: string;
  isAdmin: boolean;
}) {
  const {
    id,
    shippingAddress,
    orderitems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = "";

    if (isPending) {
      status = CONTENT_PAGE.PAYPAL_LOADING_STATE.loading;
    } else if (isRejected) {
      status = CONTENT_PAGE.PAYPAL_LOADING_STATE.error;
    }
    return status;
  };

  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id);

    if (!res.success) {
      toast({
        variant: "destructive",
        description: res.message as string,
      });
    }

    return res.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, data);

    toast({
      variant: res.success ? "default" : "destructive",
      description: res.message as string,
    });
  };

  // Button to mark order as paid
  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    return (
      <Button
        type="button"
        disabled={isPending}
        data-testid="mark-as-paid-button"
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidCOD(order.id);
            toast({
              variant: res.success ? "default" : "destructive",
              description: res.message as string,
            });
          })
        }
      >
        {isPending
          ? CONTENT_PAGE.MARK_AS_PAID.processing
          : CONTENT_PAGE.MARK_AS_PAID.markAsPaid}
      </Button>
    );
  };

  // Button to mark order as delivered
  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    return (
      <Button
        type="button"
        disabled={isPending}
        data-testid="mark-as-delivered-button"
        onClick={() =>
          startTransition(async () => {
            const res = await deliverOrder(order.id);
            toast({
              variant: res.success ? "default" : "destructive",
              description: res.message as string,
            });
          })
        }
      >
        {isPending
          ? CONTENT_PAGE.MARK_AS_DELIVERED.processing
          : CONTENT_PAGE.MARK_AS_DELIVERED.markAsDelivered}
      </Button>
    );
  };

  return (
    <>
      <h1 className="py-4 text-2xl">
        {CONTENT_PAGE.ORDER_DETAILS_PAGE.order} {formatId(id)}
      </h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-4-y overlow-x-auto">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">
                {CONTENT_PAGE.ORDER_DETAILS_PAGE.paymentMethod}
              </h2>
              <p className="mb-2">{paymentMethod}</p>
              {isPaid ? (
                <Badge variant="secondary" data-testid="paid-badge">
                  {CONTENT_PAGE.ORDER_DETAILS_PAGE.paidAt}{" "}
                  {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive" data-testid="not-paid-badge">
                  {CONTENT_PAGE.ORDER_DETAILS_PAGE.notPaid}
                </Badge>
              )}
            </CardContent>
          </Card>
          <Card className="my-2">
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">
                {CONTENT_PAGE.ORDER_DETAILS_PAGE.shippingAddress}
              </h2>
              <p>{shippingAddress.fullName}</p>
              <p className="mb-2">
                {shippingAddress.streetAddress}, {shippingAddress.city}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              {isDelivered ? (
                <Badge variant="secondary">
                  {CONTENT_PAGE.ORDER_DETAILS_PAGE.deliveredAt}{" "}
                  {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">
                  {CONTENT_PAGE.ORDER_DETAILS_PAGE.notDelivered}
                </Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">
                {CONTENT_PAGE.ORDER_DETAILS_PAGE.orderItems}
              </h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {CONTENT_PAGE.ORDER_DETAILS_PAGE.item}
                    </TableHead>
                    <TableHead>
                      {CONTENT_PAGE.ORDER_DETAILS_PAGE.quantity}
                    </TableHead>
                    <TableHead>
                      {CONTENT_PAGE.ORDER_DETAILS_PAGE.price}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderitems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={ROUTES.PRODUCT(item.slug)}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">{item.qty}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex justify-between">
                <div>{CONTENT_PAGE.ORDER_DETAILS_PAGE.items}</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>{CONTENT_PAGE.ORDER_DETAILS_PAGE.tax}</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>{CONTENT_PAGE.ORDER_DETAILS_PAGE.shipping}</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>{CONTENT_PAGE.ORDER_DETAILS_PAGE.total}</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>
              {/*PayPal Payment*/}
              {!isPaid && paymentMethod === "PayPal" && (
                <div data-testid="paypal-payment-container">
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreatePayPalOrder}
                      onApprove={handleApprovePayPalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
              {/* Cash On Delivery */}
              {isAdmin && !isPaid && paymentMethod === "CashOnDelivery" && (
                <MarkAsPaidButton />
              )}
              {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
