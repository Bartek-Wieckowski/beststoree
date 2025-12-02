import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/CheckoutSteps";
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import PaymentMethodForm from "./PaymentMethodForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Select Payment Method",
};

export default async function PaymentMethodPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not found");

  const user = await getUserById(userId);

  return (
    <div className="wrapper">
      <CheckoutSteps current={2} />
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </div>
  );
}
