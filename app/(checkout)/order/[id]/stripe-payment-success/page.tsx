import { getOrderById } from "@/lib/actions/order.actions";
import ROUTES from "@/lib/routes";
import { notFound, redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment_intent: string }>;
}) {
  const { id } = await params;
  const { payment_intent: paymentIntentId } = await searchParams;

  const order = await getOrderById(id);
  if (!order) notFound();

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (
    paymentIntent.metadata.orderId == null ||
    paymentIntent.metadata.orderId !== order.id.toString()
  ) {
    return notFound();
  }

  const isSuccess = paymentIntent.status === "succeeded";

  // Redirect to root order page after successful payment
  if (isSuccess) {
    return redirect(ROUTES.ORDER(id));
  }

  // If payment failed, redirect back to checkout order page
  return redirect(ROUTES.ORDER(id));
}
