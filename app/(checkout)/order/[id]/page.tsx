import { getOrderById } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import OrderDetailsTable from "./OrderDetailsTable";
import { PaymentResult, ShippingAddress } from "@/types";
import { auth } from "@/auth";
import Stripe from "stripe";
import ROUTES from "@/lib/routes";
import Header from "@/components/shared/header/Header";
import BottomMobileBar from "@/components/shared/BottomMobileBar";
import { getMyCart } from "@/lib/actions/cart.actions";

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

  let cartItemsCount = 0;
  try {
    const cart = await getMyCart();
    cartItemsCount = cart?.items.reduce((sum, item) => sum + item.qty, 0) ?? 0;
  } catch {
    cartItemsCount = 0;
  }

  const orderContent = (
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
  );

  // If order is paid, show with header and footer (normal layout)
  if (order.isPaid) {
    return (
      <div className="flex h-full flex-col">
        <Header />
        <main className="flex-1 wrapper">{orderContent}</main>
        <BottomMobileBar cartItemsCount={cartItemsCount} />
      </div>
    );
  }

  // If order is not paid, show without header/footer (checkout layout)
  return orderContent;
}
