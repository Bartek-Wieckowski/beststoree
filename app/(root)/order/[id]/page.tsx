import { getOrderById } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import OrderDetailsTable from "./OrderDetailsTable";
import { PaymentResult, ShippingAddress } from "@/types";
import { auth } from "@/auth";
import Stripe from "stripe";
import ROUTES from "@/lib/routes";

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
  if (!order) notFound();

  const session = await auth();

  if (order.userId !== session?.user.id && session?.user.role !== "admin") {
    return redirect(ROUTES.UNAUTHORIZED);
  }

  let client_secret = null;

  if (order.paymentMethod === "Stripe" && !order.isPaid) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: "USD",
      metadata: { orderId: order.id },
    });
    client_secret = paymentIntent.client_secret;
  }

  return (
    <div className="wrapper">
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
          paymentResult: order.paymentResult as PaymentResult,
        }}
        stripeClientSecret={client_secret}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
        isAdmin={session?.user?.role === "admin" || false}
      />
    </div>
  );
}
