import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/actions/order.actions";
import CONTENT_PAGE from "@/lib/content-page";
import ROUTES from "@/lib/routes";
import Link from "next/link";
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

  if (!isSuccess) return redirect(ROUTES.ORDER(id));

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8">
      <div className="flex flex-col gap-6 items-center">
        <h1 className="h1-bold">
          {CONTENT_PAGE.PAGE.STRIPE_PAYMENT_SUCCESS.thanksForYourPurchase}
        </h1>
        <div>
          {CONTENT_PAGE.PAGE.STRIPE_PAYMENT_SUCCESS.weAreProcessingYourOrder}
        </div>
        <Button asChild>
          <Link href={ROUTES.ORDER(id)}>
            {CONTENT_PAGE.PAGE.STRIPE_PAYMENT_SUCCESS.viewOrder}
          </Link>
        </Button>
      </div>
    </div>
  );
}
