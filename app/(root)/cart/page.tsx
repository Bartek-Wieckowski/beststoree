import { getMyCart } from "@/lib/actions/cart.actions";
import { getPresellForCart } from "@/lib/actions/presell.actions";
import CartTable from "./CartTable";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shopping Cart",
};

export default async function CartPage() {
  const cart = await getMyCart();
  const presell = cart ? await getPresellForCart(cart.items) : null;
  return <CartTable cart={cart} presell={presell} />;
}
