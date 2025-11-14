import { auth } from "@/auth";
import { getOrderById } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./OrderDetailsTable";
import { ShippingAddress } from "@/types";

export const metadata: Metadata = {
  title: "Order Details",
};

export default async function OrderPage(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) {
    return notFound();
  }

  const session = await auth();

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
    />
  );
}
